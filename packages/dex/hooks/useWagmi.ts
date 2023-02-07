import {
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { createClient, configureChains } from 'wagmi';
import { mainnet, goerli, arbitrum, optimism } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

export const chains = [mainnet, goerli, arbitrum, optimism];

const projectId = `${process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}`;

const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: projectId }),
  alchemyProvider({ apiKey: `${process.env.ALCHEMY_API_KEY}` }),
  publicProvider(),
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: projectId,
    version: '2',
    appName: `${process.env.APP_NAME}`,
    chains,
  }),
  provider,
});
