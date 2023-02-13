import {
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { createClient, configureChains } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

export const chains = [mainnet, goerli];

const projectId = `${process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}`;

const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: projectId }),
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
