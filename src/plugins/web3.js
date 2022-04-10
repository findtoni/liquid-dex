import Web3 from 'web3';
import Token from '../abis/Token.json';

export default {
  install: (app, options) => {
    app.provide('web3', new Web3(Web3.givenProvider || "http://localhost:7545"));
    app.provide('Token', Token);
  }
}