// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Voting.sol";

contract TestVoting is Voting {
    address voter1 = 0x8f748A5f24C9Bb2ee47727fB07018614B0b25897;

    function testVoterRegistering() public {
        //Voting voting = Voting(DeployedAddresses.Voting());
        Voting voting = new Voting();

        /* Register Voter */
        voting.registerVoter(voter1);

        Assert.equal(
            voting.getVoterListAddresses()[0],
            voter1,
            "Adress not registered !"
        );
    }
}
