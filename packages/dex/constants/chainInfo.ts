import { ARBITRUM_LIST, OPTIMISM_LIST } from './tokenLists';
import ethereumLogoUrl from 'assets/images/ethereum-logo.png';
import arbitrumLogoUrl from 'assets/svg/arbitrum_logo.svg';
import optimismLogoUrl from 'assets/svg/optimistic_ethereum.svg';
import polygonMaticLogo from 'assets/svg/polygon-matic-logo.svg';
import { StaticImageData } from 'next/image';

export enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,

  ARBITRUM_ONE = 42161,
  // ARBITRUM_RINKEBY = 421611,
  OPTIMISM = 10,
  // OPTIMISTIC_KOVAN = 69,
}

enum NetworkType {
  L1,
  L2,
}

interface BaseChainInfo {
  readonly networkType: NetworkType;
  readonly chainId: number;
  readonly blockWaitMsBeforeWarning?: number;
  readonly docs: string;
  readonly bridge?: string;
  readonly explorer: string;
  readonly infoLink: string;
  readonly logoUrl: string | StaticImageData;
  readonly label: string;
  readonly helpCenterUrl?: string;
  readonly nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface L1ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L1;
}

interface L2ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L2;
  readonly bridge: string;
  readonly statusPage?: string;
  readonly defaultListUrl: string;
}

type ChainInfoMap = {
  readonly [chainId: number]: L1ChainInfo | L2ChainInfo;
}

export const CHAIN_INFO: ChainInfoMap = {
  [SupportedChainId.MAINNET]: {
    networkType: NetworkType.L1,
    chainId: SupportedChainId.MAINNET,
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Ethereum',
    logoUrl: ethereumLogoUrl,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  [SupportedChainId.GOERLI]: {
    networkType: NetworkType.L1,
    chainId: SupportedChainId.GOERLI,
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://goerli.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Goerli',
    logoUrl: ethereumLogoUrl,
    nativeCurrency: { name: 'Görli Ether', symbol: 'görETH', decimals: 18 },
  },
  [SupportedChainId.OPTIMISM]: {
    networkType: NetworkType.L2,
    chainId: SupportedChainId.OPTIMISM,
    bridge: 'https://app.optimism.io/bridge',
    defaultListUrl: OPTIMISM_LIST,
    docs: 'https://optimism.io/',
    explorer: 'https://optimistic.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/optimism/',
    label: 'Optimism',
    logoUrl: optimismLogoUrl,
    statusPage: 'https://optimism.io/status',
    helpCenterUrl:
      'https://help.uniswap.org/en/collections/3137778-uniswap-on-optimistic-ethereum-oξ',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  [SupportedChainId.OPTIMISTIC_KOVAN]: {
    networkType: NetworkType.L2,
    chainId: SupportedChainId.OPTIMISTIC_KOVAN,
    bridge: 'https://app.optimism.io/bridge',
    defaultListUrl: OPTIMISM_LIST,
    docs: 'https://optimism.io/',
    explorer: 'https://optimistic.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/optimism/',
    label: 'Optimistic Kovan',
    logoUrl: optimismLogoUrl,
    statusPage: 'https://optimism.io/status',
    helpCenterUrl:
      'https://help.uniswap.org/en/collections/3137778-uniswap-on-optimistic-ethereum-oξ',
    nativeCurrency: {
      name: 'Optimistic Kovan Ether',
      symbol: 'kovOpETH',
      decimals: 18,
    },
  },
  [SupportedChainId.ARBITRUM_ONE]: {
    networkType: NetworkType.L2,
    chainId: SupportedChainId.ARBITRUM_ONE,
    bridge: 'https://bridge.arbitrum.io/',
    docs: 'https://offchainlabs.com/',
    explorer: 'https://arbiscan.io/',
    infoLink: 'https://info.uniswap.org/#/arbitrum',
    label: 'Arbitrum',
    logoUrl: arbitrumLogoUrl,
    defaultListUrl: ARBITRUM_LIST,
    helpCenterUrl:
      'https://help.uniswap.org/en/collections/3137787-uniswap-on-arbitrum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  [SupportedChainId.ARBITRUM_RINKEBY]: {
    networkType: NetworkType.L2,
    chainId: SupportedChainId.ARBITRUM_RINKEBY,
    bridge: 'https://bridge.arbitrum.io/',
    docs: 'https://offchainlabs.com/',
    explorer: 'https://rinkeby-explorer.arbitrum.io/',
    infoLink: 'https://info.uniswap.org/#/arbitrum/',
    label: 'Arbitrum Rinkeby',
    logoUrl: arbitrumLogoUrl,
    defaultListUrl: ARBITRUM_LIST,
    helpCenterUrl:
      'https://help.uniswap.org/en/collections/3137787-uniswap-on-arbitrum',
    nativeCurrency: {
      name: 'Rinkeby Arbitrum Ether',
      symbol: 'rinkArbETH',
      decimals: 18,
    },
  },
};