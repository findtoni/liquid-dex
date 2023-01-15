import { Button, IconButton } from '@chakra-ui/react';
import { useAccount, useConnect, useEnsName, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

function WalletSelector() {
  return (
    <div></div>
  );
}

export function ConnectWalletButton() {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <Button leftIcon={<WalletIcon className="h-5 w-5 text-white" />} colorScheme="blue"
    onClick={() => connect()}>
      Connect Wallet  
    </Button>
  );
}

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();

  if (isConnected) return (
    <div className="flex justify-between items-center space-x-1.5">
      <div className="py-1.5 px-2 bg-primary rounded flex justify-between items-center space-x-2">
        <p className="text-white">1.2 ETH</p>
        <p className="text-white font-medium bg-slate-800 rounded-lg px-1.5 py-0.5">
          {ensName ?? address?.slice(0, 8)}
        </p>
      </div>
      <IconButton onClick={() => disconnect()} variant="ghost" colorScheme="blue" size="sm" 
      aria-label='Disconnect wallet' icon={<ArrowRightOnRectangleIcon className="h-5 w-5 text-white" />} 
      />
    </div>
  );
  return (
    <ConnectWalletButton />
  );
}
