import { defineStore } from 'pinia';
import { ETHER_ADDRESS, formatOrder, formatUserOrder, buildGraphData } from '../helpers';
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
          all: {},
          filled: {},
          cancelled: {},
        }
      },
      accounts: [],
      networkId: null,
      totalSupply: null,
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
    }
  }
})