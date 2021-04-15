// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.11;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.0.0/contracts/access/Ownable.sol";

contract Admin is Ownable {
    mapping(address=> bool) private addressList;
    event Whitelisted(address _address);
    event Blacklisted(address _address);
    
    function isWhitelisted(address _address) public view returns (bool){
        return addressList[_address];
    }
    
    function isBlacklisted(address _address) public view returns (bool){
        return !addressList[_address];
    }
    
    function whitelist(address _address) public onlyOwner{
        addressList[_address] = true;
        emit Whitelisted(_address);
    }
    
    function blacklist(address _address) public onlyOwner{
        addressList[_address] = false;
        emit Whitelisted(_address);
    }
    
}
