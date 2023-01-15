'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, useDisclosure } from '@chakra-ui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import TokenSelectorModal from './TokenSelectorModal';
import TokenSkeleton from './TokenSkeleton';
import { TokenInfo } from '@uniswap/token-lists';
import { TokenImage } from './TokenSelectorModal';

type Token = {
  token: TokenInfo | {};
  amount: string;
  price: string;
  balance: string;
};

interface TokenInput {
  type: 'buy' | 'sell',
  token: Token,
  onMax?: () => void,
  loading?: boolean
}

export default function TokenInput({ type, token, onMax, loading }: TokenInput) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div className="bg-slate-900 rounded-lg p-3 flex flex-col space-y-1.5">
        {/* Token Balance / Set Max */}
        <div className="flex justify-between items-center text-gray-400">
          <p className="text-sm">You {type}</p>
          <div className="flex justify-between items-center space-x-1">
            <p className="text-sm">Balance: {token?.balance}</p>
            {type == 'sell' ? (
              <span
                onClick={onMax}
                className="p-0.5 bg-slate-800 rounded text-blue-300 text-xs uppercase font-medium"
              >
                max
              </span>
            ) : null}
          </div>
        </div>
        {/* Token Select / Amount */}
        <div className="flex justify-between items-center text-white">
          <div
            onClick={onOpen}
            className="flex justify-start items-center space-x-1 hover:cursor-pointer p-1 hover:rounded hover:bg-gray-600"
          >
            <TokenImage name={token.token.name} logoURI={token.token.logoURI} />
            <p className="text-xl font-medium">{token.token.symbol}</p>
            <ChevronDownIcon className="text-white h-3 w-3" />
          </div>
          {loading ? (
            <TokenSkeleton width="24" />
          ) : (
            <p className="text-xl font-medium">{token?.amount}</p>
          )}
        </div>
        {/* Token Name / Token Price */}
        <div className="flex justify-between items-center text-gray-400">
          <p className="text-sm">{token.token.name}</p>
          {loading ? (
            <TokenSkeleton width="10" />
          ) : (
            <p className="text-sm">{token?.price}</p>
          )}
        </div>
      </div>
      <TokenSelectorModal type={type} isOpen={isOpen} onClose={onClose} />
    </>
  );
}