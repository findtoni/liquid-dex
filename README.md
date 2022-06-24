# liquid-dex
[![Netlify Status](https://api.netlify.com/api/v1/badges/aff6642a-05c9-48ef-933d-0483875531ec/deploy-status)](https://app.netlify.com/sites/liquid-dex/deploys)
### Decentralized Exchange (DEX)
---

##### Stack
- Vue 3, Vite
- Pinia
- Truffle
- Chai

##### Features
- Order Book
- Metamask Wallet Support
- Buy/Sell Order
- User Trade History
- Auto-fill/Cancel Order
- Price Chart
- Smart Contract Unit Tests
---
##### Instructions
1. Run `yarn install` to install dependencies
2. Start a new development blockchain with Ganache
3. Run `truffle test` to make sure all tests pass
4. Run `truffle migrate` to build and deploy contracts to the development blockchain
5. Run `truffle exec scripts/seed-exchange.js` to seed exchange with orders and transactions
6. Run `truffle networks` to ensure the dev blockchain & app network ID's match
7. Run `yarn run dev` to start server
