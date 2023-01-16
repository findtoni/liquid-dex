import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TokenInfo } from '@uniswap/token-lists';
import GOERLI_LIST from '../constants/goerli.json';
import { SupportedChainId } from '../constants/chainInfo';

type Token = {
  token: TokenInfo,
  amount?: number;
  price?: string;
}

interface TradeState {
  chain: SupportedChainId;
  tokenIn: Token;
  tokenOut: Token;
  setTradeToken: (type: 'buy' | 'sell', token: TokenInfo) => void;
  setTradeAmount: (type: 'buy' | 'sell', amount: number) => void;
  setChain: (chain: SupportedChainId) => void;
}

export const useTradeStore = create<TradeState>()(
  devtools(
    persist((set, get) => ({
      chain: 5,
      tokenIn: {
        token: GOERLI_LIST?.tokens[0],
        amount: 0,
        price: '$1.2',
      },
      tokenOut: {
        token: GOERLI_LIST?.tokens[1],
        amount: 0,
        price: '$1.2',
      },
      setTradeToken: (type, tokenInfo) => {
        if (type === 'buy') {
          set({ tokenIn: { ...get().tokenIn, token: tokenInfo } });
        } else {
          set({ tokenOut: { ...get().tokenOut, token: tokenInfo }});
        }
      },
      setTradeAmount: (type, amount) => {
        if (type === 'buy') {
          set({ tokenIn: { ...get().tokenIn, amount } });
        } else {
          set({ tokenOut: { ...get().tokenOut, amount }});
        }
      },
      setChain: (chain) => set({ chain }),
    }), { name: 'useTrade'}),
  )
);