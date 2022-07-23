# liquid-dex
[![Netlify Status](https://api.netlify.com/api/v1/badges/aff6642a-05c9-48ef-933d-0483875531ec/deploy-status)](https://app.netlify.com/sites/liquid-dex/deploys)

Decentralized Exchange (DEX)

##### Stack
- Solidity
- Truffle
- Web3.js
- Chai
- Vue 3, Vite
- Pinia

##### Features
- Order Book
- Metamask Wallet Support
- Buy/Sell Order
- User Trade History
- Auto-fill/Cancel Order
- Price Chart
- Smart Contract Unit Tests

##### Smart Contracts on Ropsten
- [Exchange](https://ropsten.etherscan.io/address/0x2Ef12F691FB95c8122C86130324D0CB1722Ef7F1)
- [Token](https://ropsten.etherscan.io/address/0x5774E7A581ae59f2CCEf8eda4be9792911164683)

##### Instructions
1. Run `yarn install` to install dependencies
2. Start a new development blockchain with Ganache
3. Run `truffle test` to make sure all tests pass
4. Run `truffle migrate` to build and deploy contracts to the development blockchain
5. Run `truffle exec scripts/seed-exchange.js` to seed exchange with orders and transactions
6. Run `truffle networks` to ensure the dev blockchain & app network ID's match
7. Run `yarn run dev` to start server
