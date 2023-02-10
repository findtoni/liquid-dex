'use client';

import { useEffect } from 'react';
import { useNetwork } from 'wagmi';
import { Web3NetworkSwitch } from '@web3modal/react';

import { useTradeStore } from '../../store/trade';
import { useTokensStore } from '../../store/tokens';
import { SupportedChainId } from '../../constants/chainInfo';

export default function NetworkSwitch() {
  const { chain } = useNetwork();
  const trade = useTradeStore();
  const { tokenLists } = useTokensStore();

  useEffect(() => {
    const chainId = chain?.id as SupportedChainId;
    trade.setChain(chainId);

    //@ts-ignore
    const tokenList = tokenLists[chainId]?.tokens;
    if (tokenList) {
      trade.setTradeToken('sell', tokenList[0]);
      trade.setTradeToken('buy', tokenList[1]);
      trade.setTradeAmount('sell', '0');
      trade.setTradeAmount('buy', '0');
    }
  }, [chain]);

  return (
    <Web3NetworkSwitch />
  );
}