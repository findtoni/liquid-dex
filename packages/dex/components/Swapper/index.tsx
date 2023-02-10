'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useTradeStore } from '../../store/trade';
import { Network, Alchemy } from 'alchemy-sdk';
import qs from 'query-string';

import { Button } from '@chakra-ui/react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import Card from '../Card';
import TokenInput from './TokenInput';
import TokenReverse from './TokenReverse';


export default function Swapper() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenInBalance, setTokenInBalance] = useState<string | null>('');
  const {
    chain,
    tokenIn,
    tokenOut,
    estimate,
    gas,
    setTradeToken,
    setTradeGas,
    setTradePrice,
    setTradeAmount,
    setTradeEstimate,
  } = useTradeStore();

  const tradeAPI =
    chain === 1
      ? 'https://api.0x.org'
      : 'https:/goerli.api.0x.org';

  const alchemyNetwork =
    chain === 1
      ? Network.ETH_MAINNET
      : Network.ETH_GOERLI;

  const alchemyKey =
    chain === 1
      ? process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MAINNET
      : process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_GOERLI;

  async function fetchPrice(amount: string) {
    setIsLoading(true);
    const tradeParams = {
      sellToken: `${tokenIn.token.address}`,
      buyToken: `${tokenOut.token.address}`,
      sellAmount: `${Number(amount) * (10 ** tokenIn.token.decimals)}`,
      takerAddress: address,
    };

    const priceRes = await fetch(`${tradeAPI}/swap/v1/price?${qs.stringify(tradeParams)}`);
    // const quoteRes = await fetch(`${tradeAPI}/swap/v1/quote?${qs.stringify(tradeParams)}`);
    const priceResult = await priceRes.json();
    if (priceRes.status === 200) {
      const { buyAmount, gasPrice, gas } = priceResult;
      const tokenOutAmount = `${(
        Number(buyAmount) /
        10 ** tokenOut.token.decimals
      ).toFixed(4)}`;

      setTradeAmount('buy', tokenOutAmount);
      setTradeGas(`${Number(gasPrice) / 10 ** 9}`, gas);
      setTradeEstimate('buy', { amount: '0', price: '0' });
      setTradeEstimate('sell', { amount: '0', price: '0' });
    } else {
      setTradeAmount('buy', '0');
    }
    setTimeout(() => setIsLoading(false), 500);
  }

  async function fetchTokenInBalance() {
    const settings = {
      apiKey: alchemyKey,
      network: alchemyNetwork,
    };
    const alchemy = new Alchemy(settings);
    const res = await alchemy.core.getTokenBalances(
      `${address}`,
      [tokenIn.token.address],
    );
    const rawBalance = BigInt(`${res.tokenBalances[0].tokenBalance}`).toString();
    const balance = (Number(rawBalance) / (10 ** tokenIn.token.decimals)).toFixed(4).toString();

    if (balance === '0.0000') setTokenInBalance('0');
    else setTokenInBalance(balance);
  }

  async function fetchTradeData(value: string) {
    if (value === '') setTradeAmount('sell', '0');
    else setTradeAmount('sell', value);

    await fetchPrice(value);
    await fetchTokenInBalance();
  };

  function setTokenInMax() {
    // tokenIn.amount = tokenIn.balance;
  }
  function reverseToken() {
    setIsLoading(true);
    const tokenCache = tokenIn;
    setTradeToken('sell', tokenOut.token);
    setTradeToken('buy', tokenCache.token);
    setTimeout(() => setIsLoading(false), 1000);
  }
  function swap() {

  }

  return (
    <div className="pt-14">
      <Card>
        <TokenInput
          type="sell"
          token={{
            token: tokenIn.token,
            amount: tokenIn.amount,
            price: tokenIn.price,
            balance: tokenInBalance,
          }}
          onMax={setTokenInMax}
          loading={isLoading}
          onInput={fetchTradeData}
          onReverse={reverseToken}
        />
        <TokenReverse onReverse={reverseToken} />
        <TokenInput
          type="buy"
          token={{
            token: tokenOut.token,
            amount: tokenOut.amount,
            price: tokenOut.price,
          }}
          loading={isLoading}
          onReverse={reverseToken}
        />
        <TradeEstimate />
        {isConnected ? (
          <Button className="w-full" colorScheme="blue">
            Swap
          </Button>
        ) : (
          <Button className="w-full" colorScheme="blue">
            Connect Wallet
          </Button>
        )}
      </Card>
    </div>
  );
}

function TradeEstimate() {
  const { estimate, tokenIn, tokenOut, gas } = useTradeStore();

  return (
    <div className="rounded-[0.45rem] bg-gradient-to-r from-transparent via-[#0f172b70] to-transparent mt-2 mb-3 px-4 py-1 text-white flex justify-between items-center">
      <div className="w-2/3 flex flex-col space-y-2">
        <div className="flex justify-start items-center space-x-1">
          <InformationCircleIcon className="text-white h-5 w-5 mr-1" />
          <span className="text-xs font-semibold text-white">{`1 ${tokenIn.token.symbol}`}</span>
          <span className="text-xs font-semibold text-slate-600"> = </span>
          <span className="text-xs font-semibold text-white">{`${estimate.amount} ${tokenOut.token.symbol}`}</span>
          <span className="text-xs text-slate-500">{`($${estimate.price})`}</span>
        </div>
      </div>
      <div className="w-1/3 flex flex-col space-y-2 text-right">
        <p className="text-xs">{`${gas.gasPrice} gwei`}</p>
      </div>
    </div>
  );
}