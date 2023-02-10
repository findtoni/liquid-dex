'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, useDisclosure } from '@chakra-ui/react';
import {
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import TokenSelector from './TokenSelector';
import TokenSkeleton from './TokenSkeleton';
import { TokenInfo } from '@uniswap/token-lists';
import { TokenImage } from './TokenSelector';
import { useTradeStore } from '../../store/trade';

interface TokenInput {
  type: 'buy' | 'sell';
  token: {
    token: TokenInfo;
    amount: string;
    price?: string;
    balance?: string | null;
  };
  onMax?: () => void;
  onReverse: () => void;
  onInput?: ((value: string) => void) | undefined;
  loading?: boolean;
}

interface TokenInputAmount {
  amount: string;
  balance?: string | null;
  onInput: ((value: string) => void) | undefined;
}

function TokenInputAmount({ amount, balance, onInput }: TokenInputAmount) {

  return (
    <div className="token-input">
      <NumberInput
        value={amount}
        onChange={onInput}
        maxW={16}
        min={0}
        max={Number(balance)}
        variant="unstyled"
        allowMouseWheel>
        <NumberInputField />
      </NumberInput>
    </div>
  );
}

export default function TokenInput({ type, token, onMax, onReverse, onInput, loading }: TokenInput) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div className="bg-[#161c2f] rounded-lg py-3 px-4 flex flex-col space-y-1.5">
        {/* Token Balance / Set Max */}
        <div className="flex justify-between items-center text-gray-400">
          <p className="text-sm font-medium">You {type}</p>
          {type == 'sell'
            ? loading
              ? (<TokenSkeleton width="24" />)
              : (
                <div className="flex justify-between items-center space-x-1">
                  <p className="m-0 p-0 text-xs">Balance: {token.balance}</p>
                  <span
                    onClick={onMax}
                    className="p-1 bg-slate-800 rounded text-blue-300 text-[0.6rem] uppercase font-semibold">
                    max
                  </span>
                </div>
              )
            : null}
        </div>

        {/* Token Select / Amount */}
        <div className="flex justify-between items-center text-white">
          <div
            onClick={onOpen}
            className="flex justify-start items-center space-x-2 hover:cursor-pointer p-1 hover:rounded hover:bg-gray-600">
            <TokenImage
              name={token.token?.name}
              logoURI={token.token?.logoURI}
            />
            <div className="flex justify-between items-center space-x-1">
              <p className="text-lg font-semibold">{token.token?.symbol}</p>
              <ChevronDownIcon className="text-white h-3 w-3" />
            </div>
          </div>
          {type === 'sell' ? (
            <TokenInputAmount balance={token.balance} amount={token.amount} onInput={onInput} />
          ) : loading ? (
            <TokenSkeleton width="24" />
          ) : (
            <p className="text-lg font-semibold">{token.amount}</p>
          )}
        </div>

        {/* Token Name / Token Price */}
        <div className="flex justify-between items-center text-gray-400">
          <p className="text-sm font-medium capitalize">{token.token?.name}</p>
          {/* {loading
            ? (<TokenSkeleton width="10" />)
            : (<p className="text-sm">{`$ ${token?.price}`}</p>)
          } */}
        </div>
      </div>
      <TokenSelector
        type={type}
        isOpen={isOpen}
        onClose={onClose}
        onReverse={onReverse}
      />
    </>
  );
}