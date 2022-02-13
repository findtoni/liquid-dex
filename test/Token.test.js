import { tokens, EVM_REVERT } from '../helpers';

const Token = artifacts.require("Token");
require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Token', ([ deployer, receiver ]) => {
  const name = 'Liquid Token';
  const symbol = 'LQD';
  const decimals = '18';
  const totalSupply = tokens(1000000).toString();
  let token = null;
  beforeEach(async() => {
    token = await Token.new();
  });

  describe('deployment', () => {
    it('tracks token name', async() => {
      const result = await token.name();
      result.should.equal(name);
    });
    it('tracks token symbol', async() => {
      const result = await token.symbol();
      result.should.equal(symbol);
    });
    it('tracks token decimals', async() => {
      const result = await token.decimals();
      result.toString().should.equal(decimals);
    });
    it('tracks token total supply', async() => {
      const result = await token.totalSupply();
      result.toString().should.equal(totalSupply.toString());
    });
    it('assigns total supply to deployer', async() => {
      const result = await token.balanceOf(deployer);
      result.toString().should.equal(totalSupply.toString())
    })
  });
  describe('sending tokens', () => {
    let result = null;
    let amount = null;

    describe('success', async() => {
      beforeEach(async () => {
        amount = tokens(100);
        result = await token.transfer(receiver, amount, { from: deployer });
      })
      it('transfers tokens balances', async() => {
        let balanceOf = null;
        balanceOf = await token.balanceOf(deployer);
        balanceOf.toString().should.equal(tokens(999900).toString());
        balanceOf = await token.balanceOf(receiver);
        balanceOf.toString().should.equal(tokens(100).toString())
      })
      it('emits transfer event', async() => {
        const log = result.logs[0];
        log.event.should.equal('Transfer');
        const event = log.args;
        event.from.toString().should.equal(deployer,'from is correct');
        event.to.should.equal(receiver, 'to is correct');
        event.value.toString().should.equal(amount.toString(), 'value is correct');
      })
    });
    describe('failure', async() => {
      it('rejects insuffienct balances', async() => {
        let invalidAmount = null;
        invalidAmount = tokens(100000000);
        await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT);
        invalidAmount = tokens(10);
        await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT);
      });
      it('rejects invalid recipients', async() => {
        await token.transfer(0x0, amount, { from: deployer }).should.be.rejected;
      })
    })
  })
})