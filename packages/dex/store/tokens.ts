import { DEFAULT_MAINNET_TOKENS } from './../constants/tokenLists';
import { create } from 'zustand';
import GOERLI_LIST from '../constants/goerli.json';
import { TOKEN_LISTS } from '../constants/tokenLists';
import { TokenInfo, TokenList } from '@uniswap/token-lists';
import { devtools, persist } from 'zustand/middleware';
import { SupportedChainId } from '../constants/chainInfo';

interface TokenState {
  tokenLists: {
    [SupportedChainId.GOERLI]: TokenList;
    [SupportedChainId.MAINNET]: TokenList[];
    // [SupportedChainId.ARBITRUM_ONE]: TokenList[];
    // [SupportedChainId.OPTIMISM]: TokenList[];
  };
  loadTokens: () => Promise<void>;
}

export const useTokensStore = create<TokenState>()(
  devtools(
    persist(
      (set, get) => ({
        tokenLists: {
          [SupportedChainId.GOERLI]: GOERLI_LIST,
          [SupportedChainId.MAINNET]: [],
          // [SupportedChainId.ARBITRUM_ONE]: [],
          // [SupportedChainId.OPTIMISM]: [],
        },
        loadTokens: async () => {
          Promise.allSettled(TOKEN_LISTS.map(async list => await fetch(list)))
            .then(
              (res: PromiseSettledResult<Response>[]) =>
                res.filter(
                  res => res.status === 'fulfilled',
                ) as PromiseFulfilledResult<Response>[],
            )
            .then(res => res.map(res => res.value))
            .then(res => Promise.all(res.map(async res => await res.json())))
            .then(res => {
              const MAINNET_LIST = res.find(list => list.name.includes('1inch'));
              const MAINNET_TOKENS = MAINNET_LIST.tokens
                .filter(
                  (token: TokenInfo) =>
                    token.chainId === SupportedChainId.MAINNET,
                )
                .sort((a: TokenInfo, b: TokenInfo) =>
                  a.name.localeCompare(b.name),
                );
              set({
                tokenLists: {
                  [SupportedChainId.GOERLI]: GOERLI_LIST,
                  [SupportedChainId.MAINNET]: {
                    ...MAINNET_LIST,
                    tokens: MAINNET_TOKENS.filter((token: TokenInfo) => DEFAULT_MAINNET_TOKENS.includes(token.symbol)),
                  },
                  // [SupportedChainId.ARBITRUM_ONE]: res.find(list => list.name.includes('Arb')),
                  // [SupportedChainId.OPTIMISM]: res.find(list => list.name.includes('Optimism')),
                },
              });
            })
            .catch(error => console.log(error));
        },
      }),
      { name: 'useTokens' },
    ),
  ),
);