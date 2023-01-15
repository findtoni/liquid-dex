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
          set({ tokenIn: { token: tokenInfo } });
        } else {
          set({ tokenOut: { token: tokenInfo }});
        }
      },
      setChain: (chain) => set({ chain }),
    }), { name: 'useTrade'}),
  )
);