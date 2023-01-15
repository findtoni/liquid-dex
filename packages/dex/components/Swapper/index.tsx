'use client';
import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { ConnectWalletButton } from '../Wallet/ConnectWallet';
import Card from '../Card';
import TokenInput from './TokenInput';
import TokenReverse from './TokenReverse';
import { useTrade } from '../../hooks/stores/useTrade';

function MenuBar() {
  return (
    <div className="flex justify-start items-center space-x-2 pb-4">
      <p className="text-white font-semibold">Swap</p>
      <Button variant="link" size="md">Limit</Button>
    </div>
  );
}

function TradeInfo() {
  return (
    <div className="py-4 text-white flex justify-between items-center">
      <div className="flex flex-col space-y-1">
        <p className="text-xs text-gray-400">Token Cost</p>
        <p className="text-xs text-gray-400">Token Cost</p>
        <p className="text-xs text-gray-400">Transaction Cost</p>
        <p className="text-xs text-gray-400">Route</p>
      </div>
      <div className="flex flex-col space-y-1 text-right">
        <p className="text-xs">~$0</p>
        <p className="text-xs">~$0</p>
        <p className="text-xs">~$12.23</p>
        <p className="text-xs">Trade Route</p>
      </div>
    </div>
  );
}

export default function Swapper() {
  const { isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenReverse, setTokenReverse] = useState(false);
  // const tokenSell = useTrade((state) => state.tokenSell);
  // const tokenBuy = useTrade((state) => state.tokenBuy);

  const tokenBuy = {
    token:   {
      'name': 'Uniswap',
      'address': '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      'symbol': 'UNI',
      'decimals': 18,
      'chainId': 5,
      'logoURI': 'ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg'
    },
    amount: '0',
    price: '$1.2',
    balance: '1.2'
  };
  const tokenSell = {
    token: {
      'name': 'Wrapped Ether',
      'address': '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      'symbol': 'WETH',
      'decimals': 18,
      'chainId': 5,
      'logoURI': 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png'
    },
    amount: '0',
    price: '$1.2',
    balance: '1.2'
  };

  function setTokenInMax() {
    // tokenIn.amount = tokenIn.balance;
  }
  function reverseToken() {
    // const tokenOutCache = tokenOut;
    setIsLoading(true);
    // setTokenOut(tokenIn);
    // setTokenIn(tokenOutCache)
    setIsLoading(false);
  }


  return (
    <Card>
      <MenuBar />
      <TokenInput
        type="sell"
        token={tokenSell}
        onMax={setTokenInMax}
        loading={isLoading}
      />
      <TokenReverse onReverse={reverseToken} />
      <TokenInput type="buy" token={tokenBuy} loading={isLoading} />
      <TradeInfo />

      {/* Connect Wallet */}
      {isConnected ? (
        <Button className="w-full" colorScheme="blue">
          Button
        </Button>
      ) : (
        <ConnectWalletButton size="md" />
      )}
    </Card>
  );
}
