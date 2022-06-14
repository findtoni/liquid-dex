import { defineStore } from 'pinia';
import { ETHER_ADDRESS, formatOrder, formatUserOrder, buildGraphData, formatBalance } from '../helpers';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';
import _ from 'lodash';

export const useStore = defineStore('liquid', {
  state: () => {
    return {
      web3: {},
      token: {
        contract: null,
      },
      exchange: {
        contract: null,
        orders: {
          all: [],
          filled: [],
          cancelled: [],
        }
      },
      accounts: [],
      networkId: null,
      totalSupply: null,
      loading: {
        cancel: false,
        fill: false,
        balance: false,
      }
    }
  },
  getters: {
    account: (state) => state.accounts[0],
    orders(state) {
      const orders = {
        all: formatOrder(state.exchange.orders.all.sort((a, b) => b.timestamp - a.timestamp)),
        filled: formatOrder(state.exchange.orders.filled.sort((a, b) => b.timestamp - a.timestamp)),
        cancelled: formatOrder(state.exchange.orders.cancelled.sort((a, b) => b.timestamp - a.timestamp)),
      }
      return {
        all: orders.all,
        filled: orders.filled,
        cancelled: orders.cancelled,
        open: _.reject(orders.all, order => {
          const orderFilled = orders.filled.some(o => o.id === order.id);
          const orderCancelled = orders.cancelled.some(o => o.id === order.id);
          return orderFilled || orderCancelled;
        }),
      }
    },
    orderBook() {
      const formattedOrders = this.orders.open.map(order => {
        const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
        return {
          ...order,
          orderType,
          orderTypeClass: orderType === 'buy' ? 'text-green' : 'text-red',
        };
      });
      const orders = _.groupBy(formattedOrders, 'orderType');
      return ({
        buy: orders.buy.sort((a, b) => b.tokenPrice - a.tokenPrice),
        sell: orders.sell.sort((a, b) => a.tokenPrice - b.tokenPrice),
      });
    },
    userOrders() {
      return {
        filled: formatUserOrder(this.account, this.orders.filled),
        open: formatUserOrder(this.account, this.orders.open),
        cancelled: formatUserOrder(this.account, this.orders.cancelled),
      }
    },
    priceChart() {
      const orders = this.orders.filled;
      let secondLastOrder = null;
      let lastOrder = null;
      [secondLastOrder, lastOrder] = orders.slice(orders.length -2, orders.length);
      const secondLastPrice = secondLastOrder.tokenPrice || 0;
      const lastPrice = lastOrder.tokenPrice || 0;
      return {
        series: [{
          data: buildGraphData(orders),
          lastPrice,
          lastPriceChange: lastPrice >= secondLastPrice ? '+' : '-',
        }]
      }
    },
    balances(state) {
      return {
        ether: formatBalance(state.web3?.balance) || 0,
        token: formatBalance(state.token?.balance) || 0,
        exchange: {
          ether: formatBalance(state.exchange?.balance?.ether) || 0,
          token: formatBalance(state.exchange?.balance?.token) || 0,
        }
      }
    },
    orderActions(state) {
      return {
        buy: state.exchange?.buyOrder,
        sell: state.exchange?.sellOrder,
      }
    }
  },
  actions: {
    async fetchWeb3() {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      this.accounts = await web3.eth.requestAccounts();
      this.networkId = await web3.eth.net.getId()
      this.web3 = web3;
      return web3;
    },
    async fetchToken(web3) {
      const token = new web3.eth.Contract(Token.abi, Token.networks[this.networkId].address);
      this.totalSupply = await token.methods.totalSupply().call(),
      this.token.contract = token;
      return token;
    },
    async fetchExchange(web3) {
      const res = new web3.eth.Contract(Exchange.abi, Exchange.networks[this.networkId].address);
      this.exchange.contract = res;
      return res;
    },
    async fetchOrders() {
      const exchange = this.exchange.contract;
      const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' });
      const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' });
      const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' });
      this.exchange.orders.cancelled = cancelStream.map(event => event.returnValues);
      this.exchange.orders.filled = tradeStream.map(event => event.returnValues);
      this.exchange.orders.all = orderStream.map(event => event.returnValues);
    },
    async cancelOrder(order) {
      const exchange = this.exchange.contract;
      exchange.methods.cancelOrder(order.id).send({ from: this.account })
        .on('transactionHash', (hash) => {
          this.loading.cancel = true;
        }).on('error', error => console.log(error));
    },
    async subscribeToEvents() {
      const exchange = this.exchange.contract;
      exchange.events.Cancel({}, (error, event) => {
        this.loading.cancel = false;
        this.exchange.orders.cancelled.push(event.returnValues);
      });
      exchange.events.Trade({}, (error, event) => {
        this.loading.fill = false;
        const index = this.exchange.orders.filled.findIndex(order => order.id === event.returnValues.id);
        index === -1 ? this.exchange.orders.filled.push(event.returnValues) : '';
      });
      exchange.events.Order({}, (error, event) => {
        this.loading.order = false;
        const index = this.exchange.orders.open.findIndex(order => order.id === event.returnValues.id);
        index === -1 ? this.exchange.orders.open.push(event.returnValues) : '';
      });
    },
    async fillOrder(order) {
      const exchange = this.exchange.contract;
      exchange.methods.fillOrder(order.id).send({ from: this.account })
        .on('transactionHash', () => this.loading.fill = true)
        .on('error', error => console.log(error));
    },
    async loadBalances() {
      this.loading.balance = true;
      const etherBalance = await this.web3.eth.getBalance(this.account);
      const tokenBalance = await this.token.contract.methods.balanceOf(this.account).call();
      const exchangeEtherBalance = await this.exchange.contract.methods.balanceOf(ETHER_ADDRESS, this.account).call();
      const exchangeTokenBalance = await this.exchange.contract.methods.balanceOf(this.token.contract.options.address, this.account).call();
      this.web3.balance = etherBalance;
      this.token.balance = tokenBalance;
      this.exchange.balance = {
        ether: exchangeEtherBalance,
        token: exchangeTokenBalance,
      };
      this.loading.balance = false;
    },
    async buyOrder(type, amount, price) {
      if (type == 'amountChanged') {
        this.exchange.buyOrder = { ...this.exchange.buyOrder, amount: amount };
      } else if (type == 'priceChanged') {
        this.exchange.buyOrder = { ...this.exchange.buyOrder, price: price };
      }
      const order = this.exchange.buyOrder;
      const tokenGet = this.token.contract.option.address;
      const amountGet = this.web3.utils.toWei(order.amount, 'ether');
      const tokenGive = ETHER_ADDRESS;
      const amountGive = this.web3.utils.toWei((order.amount * order.price).toString(), 'ether');
      this.exchange.contract.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({ from: this.account })
        .on('transactionHash', () => this.loading.order = true)
        .on('error', error => console.log(error));
    },
    async sellOrder(type) {
      if (type == 'amountChanged') {
        this.exchange.sellOrder = { ...this.exchange.sellOrder, amount: amount };
      } else if (type == 'priceChanged') {
        this.exchange.sellOrder = { ...this.exchange.sellOrder, price: price };
      }
      const order = this.exchange.sellOrder;
      const tokenGet = ETHER_ADDRESS;
      const amountGet = this.web3.utils.toWei((order.amount * order.price).toString(), 'ether');
      const tokenGive = this.token.contract.option.address;
      const amountGive = this.web3.utils.toWei(order.amount, 'ether');
      this.exchange.contract.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({ from: this.account })
        .on('transactionHash', () => this.loading.order = true)
        .on('error', error => console.log(error));
    },
    async orderMade(order) {
      const index = this.exchange.orders.all.findIndex(o => o.id === order.id);
      index === -1 ? this.exchange.orders.all.push(order) : '';
    },
  }
})