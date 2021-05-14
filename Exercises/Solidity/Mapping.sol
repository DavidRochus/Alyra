// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.11;
 
contract Whitelist {
    mapping(address=> bool) whitelist;
    event Authorized(address _address);
}
