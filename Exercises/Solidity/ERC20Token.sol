// ERC20Token.sol
// SPDX-License-Identifier: MIT
//pragma solidity 0.6.11;
pragma solidity ^0.8.0;
 
import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
 
contract ERC20Token is ERC20 {
    
   //constructor(uint256 initialSupply) public ERC20("ALYRA", "ALY") {
    constructor(uint256 initialSupply) ERC20("ALYRA", "ALY") {
       _mint(msg.sender, initialSupply);
   }
}