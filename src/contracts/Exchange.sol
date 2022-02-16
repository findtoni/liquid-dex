// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

import 'openzeppelin-solidity/contracts/utils/math/SafeMath.sol';
import './Token.sol';

contract Exchange {
  using SafeMath for uint;

  address public feeAccount;
  uint256 public feePercent;
  address constant ETHER = address(0);
  mapping(address => mapping(address => uint256)) public tokens;

  event Deposit(address token, address user, uint256 amount, uint256 balance);

  constructor(address _feeAccount, uint256 _feePercent) {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  fallback() external {
    revert();
  }
  function depositEther() payable public { // payable modifier needed to accept Ether
    tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
    emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
  }
  function depositToken(address _token, uint _amount) public {
    require(_token != ETHER);
    require(Token(_token).transferFrom(msg.sender, address(this), _amount));
    tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }
}