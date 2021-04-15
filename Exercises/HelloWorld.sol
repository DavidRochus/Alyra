// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.11;

contract HelloWorld {
    string myString = "Hello World !";
    
    function hello() public view returns (string memory) {
        return myString;
    }
} 