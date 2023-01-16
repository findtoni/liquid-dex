import { createClient, configureChains } from 'wagmi';
import { mainnet, goerli, arbitrum, optimism } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { provider } = configureChains(
  [mainnet, goerli, arbitrum, optimism],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY }),
    publicProvider(),
  ]
);

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
});
