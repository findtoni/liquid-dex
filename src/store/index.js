import { defineStore } from 'pinia';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';

export const useStore = defineStore('liquid', {
  state: () => {
    return {
      web3: {},
      token: {},
      exchange: {},
      accounts: [],
      networkId: null,
      totalSupply: null,
    }
  },
  getters: {
    account: (state) => state.accounts[0]
  },
  actions: {
    async fetchWeb3() {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      this.accounts = await web3.eth.getAccounts();
      this.networkId = await web3.eth.net.getId()
      this.web3 = web3;
      return web3;
    },
    async fetchToken(web3) {
      const token = new web3.eth.Contract(Token.abi, Token.networks[this.networkId].address);
      this.totalSupply = await token.methods.totalSupply().call(),
      this.token = token;
      return token;
    },
    async fetchExchange(web3) {
      const res = new web3.eth.Contract(Exchange.abi, Exchange.networks[this.networkId].address);
      this.exchange = res;
      return res;
    }
  }
})