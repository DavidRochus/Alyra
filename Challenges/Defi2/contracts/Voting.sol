// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.11;

import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.0.0/contracts/access/Ownable.sol";

contract Voting is Ownable {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }

    struct Proposal {
        string description;
        uint256 voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    uint256 private winningProposalId;
    WorkflowStatus private currentWorkflowStatus =
        WorkflowStatus.RegisteringVoters;
    Proposal[] public proposals;
    mapping(address => Voter) private voterList;
    address[] private voterListAddresses;

    event VoterRegistered(address voterAddress);
    event ProposalsRegistrationStarted();
    event ProposalsRegistrationEnded();
    event ProposalRegistered(uint256 proposalId);
    event VotingSessionStarted();
    event VotingSessionEnded();
    event Voted(address voter, uint256 proposalId);
    event VotesTallied();
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    modifier onlyValidWorkflowStatus(WorkflowStatus _validWorkflowStatus) {
        require(
            currentWorkflowStatus == _validWorkflowStatus,
            "Action is not allowed in the current phase !"
        );
        _;
    }

    modifier onlyRegisteredVoters() {
        require(
            isVoterRegistered(msg.sender),
            "Only registered voters can execute this action !"
        );
        _;
    }

    modifier onlyIfVoted(address _voterAddress) {
        require(hasVoted(_voterAddress), "User has no validated vote !");
        _;
    }

    modifier onlyIfNotVoted(address _voterAddress) {
        require(
            !hasVoted(_voterAddress),
            "User has already a validated vote !"
        );
        _;
    }

    function nextWorkflowStatus() public onlyOwner {
        WorkflowStatus _previousStatus = currentWorkflowStatus;
        if (currentWorkflowStatus == WorkflowStatus.RegisteringVoters) {
            currentWorkflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
            emit ProposalsRegistrationStarted();
        } else if (
            currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationStarted
        ) {
            currentWorkflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
            emit ProposalsRegistrationEnded();
        } else if (
            currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationEnded
        ) {
            currentWorkflowStatus = WorkflowStatus.VotingSessionStarted;
            emit VotingSessionStarted();
        } else if (
            currentWorkflowStatus == WorkflowStatus.VotingSessionStarted
        ) {
            currentWorkflowStatus = WorkflowStatus.VotingSessionEnded;
            emit VotingSessionEnded();
        } else if (currentWorkflowStatus == WorkflowStatus.VotingSessionEnded) {
            tallyVotes();
            currentWorkflowStatus = WorkflowStatus.VotesTallied;
            emit VotesTallied();
        }
        if (_previousStatus != currentWorkflowStatus) {
            emit WorkflowStatusChange(_previousStatus, currentWorkflowStatus);
        }
    }

    function getWorkflowStatus()
        public
        view
        onlyOwner
        returns (WorkflowStatus)
    {
        return currentWorkflowStatus;
    }

    function registerVoter(address _address)
        public
        onlyOwner
        onlyValidWorkflowStatus(WorkflowStatus.RegisteringVoters)
    {
        voterList[_address].isRegistered = true;
        voterListAddresses.push(_address);
        emit VoterRegistered(_address);
    }

    /* DRODRO --> */
    function getVoterListAddresses()
        public
        view
        onlyOwner
        returns (address[] memory)
    {
        return voterListAddresses;
    }

    function getProposalCount() public view returns (uint256) {
        return proposals.length;
    }

    /* <-- DRODRO */

    function isVoterRegistered(address _voterAddress)
        public
        view
        returns (bool)
    {
        return voterList[_voterAddress].isRegistered;
    }

    function registerProposal(string memory _description)
        public
        onlyValidWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted)
        onlyRegisteredVoters
    {
        Proposal memory proposal;
        proposal.description = _description;
        proposal.voteCount = 0;
        proposals.push(proposal);
        emit ProposalRegistered(proposals.length);
    }

    function voteForProposal(uint256 _proposalId)
        public
        onlyValidWorkflowStatus(WorkflowStatus.VotingSessionStarted)
        onlyRegisteredVoters
        onlyIfNotVoted(msg.sender)
    {
        proposals[_proposalId].voteCount++;
        voterList[msg.sender].hasVoted = true;
        voterList[msg.sender].votedProposalId = _proposalId;
        emit Voted(msg.sender, _proposalId);
    }

    function hasVoted(address _address) private view returns (bool) {
        return voterList[_address].hasVoted;
    }

    function getVoteFromVoter(address _voterAddress)
        public
        view
        onlyRegisteredVoters
        onlyIfVoted(_voterAddress)
        returns (uint256)
    {
        return voterList[_voterAddress].votedProposalId;
    }

    function tallyVotes()
        private
        onlyOwner
        onlyValidWorkflowStatus(WorkflowStatus.VotingSessionEnded)
        onlyRegisteredVoters
    {
        //TODO: Manage equality
        uint256 maxVoteCount = 0;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxVoteCount) {
                winningProposalId = i;
                proposals[i].voteCount;
            }
        }
    }

    function getWinningProposal()
        public
        view
        onlyValidWorkflowStatus(WorkflowStatus.VotesTallied)
        returns (string memory)
    {
        return proposals[winningProposalId].description;
    }
}
