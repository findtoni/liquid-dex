'use client';

import Image from 'next/image'; 
import { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';  
import { useTradeStore } from '../../store/trade';
import { L1ChainInfo, L2ChainInfo, CHAIN_INFO, SupportedChainId } from '../../constants/chainInfo';

function ChainLogo({ src, alt }: { src: string, alt: string }) {
  return <Image src={src} alt={alt} width={20} height={20} className="rounded" />;
}

export default function NetworkSelector() {
  const trade = useTradeStore();
  const chains = [
    CHAIN_INFO[SupportedChainId.MAINNET],
    CHAIN_INFO[SupportedChainId.GOERLI],
    CHAIN_INFO[SupportedChainId.ARBITRUM_ONE],
    CHAIN_INFO[SupportedChainId.OPTIMISM],
  ];
  const activeChain = chains.find(chain => chain.chainId === trade.chain);

  return (
    <Menu>
      <MenuButton as={Button} leftIcon={<ChainLogo src={activeChain.logoUrl} alt={activeChain.label} />} 
        rightIcon={<ChevronDownIcon className="w-4 h-4" />}>
        { chains.find(chain => chain.chainId === trade.chain)?.label }
      </MenuButton>
      <MenuList>
        { chains.filter(chain => chain.chainId !== trade.chain)?.map((chain, index) =>
          <MenuItem key={index} onClick={() => trade.setChain(chain.chainId)} 
            icon={<ChainLogo src={chain.logoUrl} alt={chain.label} />}>
            { chain.label }
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}