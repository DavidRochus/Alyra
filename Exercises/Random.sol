// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

contract Random {
    uint private nonce = 0;
    
    function random() public returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % 100;
        nonce++;
        return rand;
   }
}