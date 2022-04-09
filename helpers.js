export const ether = (n) => new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'));
export const EVM_REVERT = 'VM Exception while processing transaction: revert';
export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
export const tokens = (n) => ether(n);
export const wait = (seconds) => {
  const milliseconds = seconds * 1000;
  return setTimeout(resolve, milliseconds);
}