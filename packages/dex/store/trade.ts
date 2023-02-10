import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { TokenInfo } from '@uniswap/token-lists';
import GOERLI_LIST from '../constants/goerli.json';
import { SupportedChainId } from '../constants/chainInfo';

type Token = {
  token: TokenInfo,
  amount: string;
  price?: string;
}

type TokenType = 'buy' | 'sell';

interface TradeState {
  chain: SupportedChainId;
  tokenIn: Token;
  tokenOut: Token;
  gas: {
    gasPrice: string;
    gas: string;
  };
  estimate: {
    amount: string;
    price: string;
  };
  setTradeToken: (type: TokenType, token: TokenInfo) => void;
  setTradeAmount: (type: TokenType, amount: string) => void;
  setTradePrice: (type: TokenType, price: string) => void;
  setTradeEstimate: (
    type: TokenType,
    estimate: { amount: string; price: string },
  ) => void;
  setTradeGas: (gasPrice: string, gas: string) => void;
  setChain: (chain: SupportedChainId) => void;
  isDuplicate: (token: TokenInfo) => boolean;
}

export const useTradeStore = create<TradeState>()(
  devtools(
    persist((set, get) => ({
      chain: 5,
      tokenIn: {
        token: GOERLI_LIST?.tokens[0],
        amount: '',
        price: '',
      },
      tokenOut: {
        token: GOERLI_LIST?.tokens[1],
        amount: '',
        price: '',
      },
      gas: {
        gasPrice: '',
        gas: '',
      },
      estimate: {
        amount: '',
        price: '',
      },
      setTradeToken: (type, token) => {
        const { tokenIn, tokenOut } = get();
        if (type === 'sell') {
          set({ tokenIn: { ...tokenIn, token: token } });
        } else {
          set({ tokenOut: { ...tokenOut, token: token }});
        }
      },
      setTradeAmount: (type, amount) => {
        const { tokenIn, tokenOut } = get();
        if (type === 'sell') {
          set({ tokenIn: { ...tokenIn, amount } });
        } else {
          set({ tokenOut: { ...tokenOut, amount }});
        }
      },
      setTradePrice: (type, price) => {
        const { tokenIn, tokenOut } = get();
        if (type === 'sell') {
          set({ tokenIn: { ...tokenIn, price } });
        } else {
          set({ tokenOut: { ...tokenOut, price }});
        }
      },
      setTradeEstimate: (type, estimate) => {
        set({ estimate: estimate });
      },
      setTradeGas: (gasPrice, gas) => {
        set({ gas: { gasPrice, gas } });
      },
      setChain: (chain) => set({ chain }),
      isDuplicate: (token) => {
        const { tokenIn, tokenOut } = get();
        return tokenIn.token.address === token.address || tokenOut.token.address === token.address;
      }
    }), { name: 'useTrade'}),
  )
);