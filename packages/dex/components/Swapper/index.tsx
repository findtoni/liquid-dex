'use client';

import { useState, useEffect } from 'react';
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
  const [tokenInBalance, setTokenInBalance] = useState<string | null>('0');
  const [hasFunds, setHasFunds] = useState(false);
  const [hasAmount, setHasAmount] = useState(false);

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

  async function fetchPrice(sellAmount: string) {
    const tradeParams = {
      sellToken: `${tokenIn.token.address}`,
      buyToken: `${tokenOut.token.address}`,
      sellAmount: `${Number(sellAmount) * (10 ** tokenIn.token.decimals)}`,
      takerAddress: address,
    };

    const priceRes = await fetch(`${tradeAPI}/swap/v1/price?${qs.stringify(tradeParams)}`);
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
  }

  async function fetchTokenInBalance(sellAmount?: string) {
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

    if (sellAmount) {
      if (Number(balance) >= Number(sellAmount)) {
        setHasFunds(true);
      } else setHasFunds(false);
      if (Number(sellAmount) === 0) setHasAmount(false);
      else setHasAmount(true);
    }
  }

  async function fetchTradeData(sellAmount: string) {
    setIsLoading(true);
    setTradeAmount('sell', sellAmount);
    await fetchPrice(sellAmount);
    await fetchTokenInBalance(sellAmount);
    setIsLoading(false);
  }

  async function setTokenInMax() {
    setIsLoading(true);
    await fetchTokenInBalance();
    setTradeAmount('sell', `${tokenInBalance}`);
    await fetchPrice(`${tokenInBalance}`);
    setIsLoading(false);
  }

  function reverseToken() {
    const tokenCache = tokenIn;
    setIsLoading(true);
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
          <Button
            className="w-full"
            isDisabled={!hasFunds || !hasAmount}
            colorScheme="blue">
            {hasFunds
              ? 'Swap'
              : !hasAmount
              ? 'Enter Amount'
              : 'Insufficient Balance'}
          </Button>
        ) : (
          <Button className="w-full" isDisabled={true} colorScheme="blue">
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