// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";

contract Bank  {
    using SafeMath for uint;
    mapping(address=> uint) private _balance;
     
    function deposit(uint _amount) public{
        require(msg.sender != address(0), "You cannot deposit for the address zero");
        _balance[msg.sender] = _balance[msg.sender].add(_amount);
    }

    function transfer(address _recipient, uint _amount) public{
        require(_recipient != address(0), "You cannot transfer to the address zero");
        require(_balance[msg.sender] >= _amount, "You don't have enough funds to execute this transfer");
        _balance[msg.sender] = _balance[msg.sender].sub(_amount);
        _balance[_recipient] = _balance[_recipient].add(_amount);
    }
    
    function balanceOf(address _recipient) public view returns (uint){
        return _balance[_recipient];
    }
}