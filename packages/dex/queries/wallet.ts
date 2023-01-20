import { gql } from '@apollo/client';

const GET_WALLET_TOKENS = gql`
  query WalletTokens($ensName: String!) {
    wallet(ensName: $ensName) {
      tokens {
        edges {
          node {
            tokenId
            contract {
              ... on ERC721Contract {
                symbol
                name
              }
            }
          }
        }
      }
    }
  }
`;

export { GET_WALLET_TOKENS };