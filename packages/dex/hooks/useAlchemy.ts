import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY_GOERLI,
  network: Network.ETH_GOERLI,
};

export const alchemy = new Alchemy(settings);