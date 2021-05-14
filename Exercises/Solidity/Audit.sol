pragma solidity ^0.5.12;

/* AUDIT --> Import SafeMath library to use it */
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.4.0/contracts/math/SafeMath.sol";
/* <-- AUDIT */

contract Crowdsale {
   using SafeMath for uint256;
 
   address public owner; // the owner of the contract
   /* AUDIT --> address must be payable in order to send ETH 
   address public escrow; // wallet to collect raised ETH */
   address payable public escrow; // wallet to collect raised ETH 
   /* <-- AUDIT */
   uint256 public savedBalance = 0; // Total amount raised in ETH
   mapping (address => uint256) public balances; // Balances in incoming Ether
 
   // Initialization
   /* AUDIT --> Function can't have the same name than Contract. Constuctor must be used
      AUDIT --> address must be payable in order to send ETH
   function Crowdsale(address _escrow) public{ */
   constructor(address payable _escrow) public{
   /* <-- AUDIT */
       /* AUDIT --> prefer use of msg.sender
       owner = tx.origin; */
       owner = msg.sender;
       /* <-- AUDIT */
       // add address of the specific contract
       escrow = _escrow;
   }
   
   // function to receive ETH
   /* AUDIT --> Fallback method must be payable and external
   function() public { */
   function() payable external { 
       /* AUDIT --> Ensure that the fallback method wasn't called by error */
       require(msg.data.length == 0);
       /* <-- AUDIT */
       /* AUDIT --> We have to put condition on this code to let the possibility to the escrow to 
                    send back the ETH to the smart contract otherwise investisor will not be able 
                    to get back their ETH */
       if(msg.sender != escrow) {
          balances[msg.sender] = balances[msg.sender].add(msg.value);
          savedBalance = savedBalance.add(msg.value);
          /* AUDIT --> Prefer use of transfer() to manage exception
          escrow.send(msg.value); */
          escrow.transfer(msg.value);
          /* <-- AUDIT */
       }
       /* <-- AUDIT */
   }
  
   // refund investisor
   function withdrawPayments() public{
       /* AUDIT --> address must be payable in order to send ETH 
       address payee = msg.sender; */
       address payable payee = msg.sender;
       /* <-- AUDIT */
       uint256 payment = balances[payee];
       /* AUDIT --> Revert call if there is no funds */
       require(payment > 0,"No funds to withdraw");
       /* <-- AUDIT */
       /* AUDIT --> To prevent Reentrency, State variable change must be executed before payment */
       savedBalance = savedBalance.sub(payment);
       balances[payee] = 0;
       /* <-- AUDIT */
       /* AUDIT --> Prefer use of transfer() to manage exception
       payee.send(payment); */
       payee.transfer(payment);
       /* <-- AUDIT */
 
       /* AUDIT --> To prevent Reentrency, State variable change must be executed before payment
       savedBalance = savedBalance.sub(payment);
       balances[payee] = 0;*/
       /* <-- AUDIT */
   }
 
}
