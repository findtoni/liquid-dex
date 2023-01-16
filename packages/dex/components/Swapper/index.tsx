'use client';
import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { ConnectWalletButton } from '../Wallet/ConnectWallet';
import Card from '../Card';
import TokenInput from './TokenInput';
import TokenReverse from './TokenReverse';
import { useTradeStore } from '../../store/trade';

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
  const { tokenIn, tokenOut, setTradeToken } = useTradeStore();

  function setTokenInMax() {
    // tokenIn.amount = tokenIn.balance;
  }
  function reverseToken() {
    setIsLoading(true);
    const tokenCache = tokenOut;
    setTradeToken('sell', tokenIn.token);
    setTradeToken('buy', tokenCache.token);
    setTimeout(() => setIsLoading(false), 1000);
  }


  return (
    <Card>
      <MenuBar />
      <TokenInput
        type="sell"
        token={tokenOut}
        onMax={setTokenInMax}
        loading={isLoading}
        onReverse={reverseToken}
      />
      <TokenReverse onReverse={reverseToken} />
      <TokenInput
        type="buy"
        token={tokenIn}
        loading={isLoading}
        onReverse={reverseToken}
      />
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
