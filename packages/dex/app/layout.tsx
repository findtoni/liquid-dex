'use client';

// styles
import '../styles/tailwind.css';
import '../styles/globals.scss';

// providers
import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';

// clients
import { chains, wagmiClient } from '../hooks/useWagmi';
import { apolloClient } from '../hooks/useApollo';
import { EthereumClient } from '@web3modal/ethereum';
const ethereumClient = new EthereumClient(wagmiClient, chains);

// components
import { WagmiConfig } from 'wagmi';
import { Web3Modal } from '@web3modal/react';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Liquid DEX</title>
        <meta
          name="description"
          content="Swap crypto tokens across multi-chains"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="https://fav.farm/⚡" />
      </head>
      <body className="liquid">
        <WagmiConfig client={wagmiClient}>
          <ApolloProvider client={apolloClient}>
            <ChakraProvider>{children}</ChakraProvider>
          </ApolloProvider>
        </WagmiConfig>
        <Web3Modal
          //@ts-ignore
          projectId={process.env.WALLETCONNECT_PROJECT_ID}
          ethereumClient={ethereumClient}
        />
      </body>
    </html>
  );
}