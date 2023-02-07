import { Web3Button } from '@web3modal/react';

interface Web3ButtonProps {
  icon?: 'show' | 'hide';
  label?: string;
  balance?: 'show' | 'hide';
}

export default function Wallet() {
  return (
    <Web3Button balance="show" />
  );
}