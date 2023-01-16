'use client';

import '../styles/tailwind.css';
import '../styles/globals.scss';

import { ChakraProvider } from '@chakra-ui/react';
import { WagmiConfig } from 'wagmi';
import { WagmiClient } from '../hooks/useWagmi';
import { ApolloClient } from '../hooks/useApollo';
import { ApolloProvider } from '@apollo/client';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Liquid DEX</title>
        <meta name="description" content="Swap crypto tokens across multi-chains" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="https://fav.farm/🔁" />
      </head>
      <body className="liquid">
        <WagmiConfig client={WagmiClient}>
          <ApolloProvider client={ApolloClient}>
            <ChakraProvider>{children}</ChakraProvider>
          </ApolloProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}