// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.11;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.0.0/contracts/access/Ownable.sol";

contract PullPayment is Ownable {

    mapping(address => uint) credits;
    
    event LogPushCredits(address _sender, uint _amount);
    event LogPullCredits(address _receiver, uint _amount);

    // Only for test purpose (By the contract owner)
    function getBalance() public view onlyOwner returns(uint _balance){
        return address(this).balance;
    }

    function allowForPull(address _receiver, uint _amount) internal {
        credits[_receiver] += _amount;
    }
    
    function pushCredits() public payable {
        allowForPull(msg.sender, msg.value);
        emit LogPushCredits(msg.sender, msg.value);
    }

    function pullCredits() public {
        uint amount = credits[msg.sender];

        require(amount != 0, "No credit available for this address !");
        require(address(this).balance >= amount,"No credits left on this contract!");

        credits[msg.sender] = 0;

        msg.sender.transfer(amount);
        emit LogPullCredits(msg.sender, amount);
    }
    
}
