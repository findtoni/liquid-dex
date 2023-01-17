import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TokenInfo } from '@uniswap/token-lists';
import GOERLI_LIST from '../constants/goerli.json';
import { SupportedChainId } from '../constants/chainInfo';

type Token = {
  token: TokenInfo,
  amount: number;
  price?: string;
}

interface TradeState {
  chain: SupportedChainId;
  tokenIn: Token;
  tokenOut: Token;
  setTradeToken: (type: 'buy' | 'sell', token: TokenInfo) => void;
  setTradeAmount: (type: 'buy' | 'sell', amount: number) => void;
  setChain: (chain: SupportedChainId) => void;
  isDuplicate: (token: TokenInfo) => boolean;
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
      setTradeToken: (type, token) => {
        const { tokenIn, tokenOut } = get();
        if (type === 'buy') {
          set({ tokenIn: { ...tokenIn, token: token } });
        } else {
          set({ tokenOut: { ...tokenOut, token: token }});
        }
      },
      setTradeAmount: (type, amount) => {
        const { tokenIn, tokenOut } = get();
        if (type === 'buy') {
          set({ tokenIn: { ...tokenIn, amount } });
        } else {
          set({ tokenOut: { ...tokenOut, amount }});
        }
      },
      setChain: (chain) => set({ chain }),
      isDuplicate: (token) => {
        const { tokenIn, tokenOut } = get();
        return tokenIn.token.address === token.address || tokenOut.token.address === token.address;
      }
    }), { name: 'useTrade'}),
  )
);