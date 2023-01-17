import { useState, useEffect, useCallback } from 'react';
import { useProvider } from 'wagmi'
import { ethers, providers } from 'ethers';
import { computePoolAddress, FeeAmount } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';
import { TokenInfo } from '@uniswap/token-lists';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import { toReadableAmount, fromReadableAmount } from '../../utils/conversion';
import { useTradeStore } from '../../store/trade';

const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';

type PoolConstants = {
  token0: string;
  token1: string;
  fee: number;
}

function getToken(tokenInfo: TokenInfo): Token {
  return new Token(
    tokenInfo?.chainId,
    tokenInfo?.address,
    tokenInfo?.decimals,
    tokenInfo?.symbol,
    tokenInfo?.name,
  );
}

export default function TokenQuote() {
  const [quote, setQuote] = useState<string>();
  const provider = useProvider();
  const trade = useTradeStore();
  const tokenIn = getToken(trade.tokenIn.token);
  const tokenOut = getToken(trade.tokenOut.token);
  const amountIn = trade.tokenIn.amount;
  const poolFee = FeeAmount.MEDIUM;

  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: poolFee,
  });

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider,
  );

  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    provider,
  );

  async function getPool() {
    const [token0, token1, fee] = await Promise.all([
      poolContract?.token0(),
      poolContract?.token1(),
      poolContract?.fee(),
    ]);
    return { token0, token1, fee };
  }

  async function getQuote() {
    try {
      const poolConstants = await getPool();
      const quotedAmountOut = await quoterContract?.callStatic.quoteExactInputSingle(
        poolConstants.token0,
        poolConstants.token1,
        poolConstants.fee,
        fromReadableAmount(
          amountIn,
          tokenIn.decimals
        ),
        0
      );

      return toReadableAmount(quotedAmountOut, tokenOut.decimals);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <p>{quote}</p>
  );
}