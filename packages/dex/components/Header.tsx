import NetworkSelector from './Wallet/NetworkSelector';
import ConnectWallet from './Wallet/ConnectWallet';

export default function Header() {
  return (
    <div className="py-8">
      <div className="container">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl text-white">Liquid</h1>
          <div className="w-full flex justify-end items-center space-x-3">
            <NetworkSelector />
            <ConnectWallet />
          </div>
        </div>
      </div>
    </div>
  );
}
