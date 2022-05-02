import { defineStore } from 'pinia';
import { formatOrder, formatOrderStyle } from '../helpers';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';

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
    allOrders(state) {
      let orders = state.exchange.orders.all.sort((a, b) => b.timestamp - a.timestamp);
      let previousOrder = orders[0];
      return orders.map(order => {
        order = formatOrder(order);
        order = formatOrderStyle(order, previousOrder);
        previousOrder = order;
        return order;
      });
    },
    filledOrders(state) {
      let orders = state.exchange.orders.filled.sort((a, b) => b.timestamp - a.timestamp);
      let previousOrder = orders[0];
      return orders.map(order => {
        order = formatOrder(order);
        order = formatOrderStyle(order, previousOrder);
        previousOrder = order;
        return order;
      });
    },
    cancelledOrders(state) {
      let orders = state.exchange.orders.cancelled.sort((a, b) => b.timestamp - a.timestamp);
      let previousOrder = orders[0];
      return orders.map(order => {
        order = formatOrder(order);
        order = formatOrderStyle(order, previousOrder);
        previousOrder = order;
        return order;
      });
    },
    openOrders(state) {
      return
    },
    orderBook(state) {

    }
  },
  actions: {
    async fetchWeb3() {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
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
    async fetchOrders(exchange) {
      const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' });
      const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' });
      const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' });
      this.exchange.orders.cancelled = cancelStream.map(event => event.returnValues);
      this.exchange.orders.filled = tradeStream.map(event => event.returnValues);
      this.exchange.orders.all = orderStream.map(event => event.returnValues);
    }
  }
})