import NetworkSwitch from './Wallet/Chains';
import WalletConnect from './Wallet/Connection';

export default function Header() {
  return (
    <div className="py-8">
      <div className="container">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl text-white">Liquid</h1>
          <div className="w-full flex justify-end items-center space-x-3">
            <NetworkSwitch />
            <WalletConnect />
          </div>
        </div>
      </div>
    </div>
  );
}
