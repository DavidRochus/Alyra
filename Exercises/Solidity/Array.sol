// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.11;
contract Whitelist {
  struct Person {
      string name;
      uint age;  
  }
  Person[] public persons;
  
  function add(string memory _name, uint _age) public{
        Person memory person;
        person.name = _name;
        person.age = _age;
        persons.push(person);
   } 
   
    function remove() public{
        persons.pop();
   } 
}
