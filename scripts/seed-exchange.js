const ether = (n) => new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'));
const EVM_REVERT = 'VM Exception while processing transaction: revert';
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
const tokens = (n) => ether(n);
const wait = (seconds) => {
  const milliseconds = seconds * 1000;
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const Token = artifacts.require('Token');
const Exchange = artifacts.require('Exchange');

module.exports = async function(callback) {
  try {
    // fetch accounts from wallet
    const accounts = await web3.eth.getAccounts();

    // fetch deployed token
    const token = await Token.deployed();
    console.log('Token fetched:', token.address);

    // fetch deployed exchange
    const exchange = await Exchange.deployed();
    console.log('Exchange fetched:', exchange.address);

    // give tokens to account[1]
    const sender = accounts[0];
    const receiver = accounts[1];
    let amount = web3.utils.toWei('10000', 'ether'); // 10,000 tokens

    await token.transfer(receiver, amount, { from: sender });
    console.log(`Transferred ${amount} tokens from ${sender} to ${receiver}`);

    // setup exchange users
    const user1 = accounts[0];
    const user2 = accounts[1];

    // user 1 deposits ether
    amount = 1;
    await exchange.depositEther({ from: user1, value: ether(amount) });
    console.log(`Deposited ${amount} Wther from ${user1}`);

    // user 2 approves tokens
    amount = 10000;
    await token.approve(exchange.address, tokens(amount), { from: user2 });
    console.log(`Approved ${amount} tokens from ${user2}`);

    // user 2 deposits tokens
    await exchange.depositToken(token.address, tokens(amount), { from: user2 });
    console.log(`Deposited ${amount} tokens from ${user2}`);

    // seed a cancelled order
    // user 1 makes order to get tokens
    let result = null;
    let orderId = null;
    result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 });
    console.log(`Made order from ${user1}`);

    // user 1 cancels order
    orderId = result.logs[0].args.id;
    await exchange.cancelOrder(orderId, { from: user1 });
    console.log(`Cancelled order ${orderId} from ${user1}`);

    // seed a filled order
    // user 1 makes order
    result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 });
    console.log(`Made order from ${user1}`);

    // user 2 fills order
    orderId = result.logs[0].args.id;
    await exchange.fillOrder(orderId, { from: user2 });
    console.log(`Filled order ${orderId} from ${user1}`);

    // wait one second
    await wait(1);

    // user 1 makes another order
    result = await exchange.makeOrder(token.address, tokens(50), ETHER_ADDRESS, ether(0.1), { from: user1 });
    console.log(`Made order from ${user1}`);

    // wait one second
    await wait(1);

    // user 2 fills another order
    orderId = result.logs[0].args.id;
    await exchange.fillOrder(orderId, { from: user2 });
    console.log(`Filled order ${orderId} from ${user1}`);

    // wait one second
    await wait(1);

    // user 1 makes final order
    result = await exchange.makeOrder(token.address, tokens(200), ETHER_ADDRESS, ether(0.15), { from: user1 });
    console.log(`Made order from ${user1}`);

    // use 2 fills final order
    orderId = result.logs[0].args.id;
    await exchange.cancelOrder(orderId, { from: user1 });
    console.log(`Cancelled order ${orderId} from ${user1}`);

    // wait one second
    await wait(1);

    // seed open orders
    // user 1 makes 10 orders
    for (let i = 1; i <= 10; i++) {
      result = await exchange.makeOrder(token.address, tokens(10 * i), ETHER_ADDRESS, ether(0.01), { from: user1 });
      console.log(`Made order from ${user1}`);
      await wait(1);
    }
    for (let i = 1; i <= 10; i++) {
      result = await exchange.makeOrder(ETHER_ADDRESS, ether(0.01), token.address, tokens(10 * i), { from: user2 });
      console.log(`Made order from ${user2}`);
      await wait(1);
    }
  } catch(error) { console.log(error) }
  callback();
}