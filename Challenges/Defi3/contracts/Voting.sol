// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.11;

import "@openzeppelin/contracts/access/Ownable.sol";

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

    uint256 public winningProposalId;
    WorkflowStatus public currentWorkflowStatus =
        WorkflowStatus.RegisteringVoters;
    Proposal[] public proposals;
    mapping(address => Voter) public voterList;
    address[] public voterListAddresses;

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

    function nextWorkflowStatus() external onlyOwner {
        WorkflowStatus _previousStatus = currentWorkflowStatus;
        if (currentWorkflowStatus == WorkflowStatus.RegisteringVoters) {
            require(voterListAddresses.length > 0, "Register at least 1 Voter");
            currentWorkflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
            emit ProposalsRegistrationStarted();
        } else if (
            currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationStarted
        ) {
            require(proposals.length > 0, "Register at least 1 proposal");
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

    function getWorkflowStatus() external view returns (WorkflowStatus) {
        return currentWorkflowStatus;
    }

    function registerVoter(address _address)
        external
        onlyOwner
        onlyValidWorkflowStatus(WorkflowStatus.RegisteringVoters)
    {
        voterList[_address].isRegistered = true;
        voterListAddresses.push(_address);
        emit VoterRegistered(_address);
    }

    function getVoterListAddresses() external view returns (address[] memory) {
        return voterListAddresses;
    }

    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }

    function isVoterRegistered(address _voterAddress)
        public
        view
        returns (bool)
    {
        return voterList[_voterAddress].isRegistered;
    }

    function registerProposal(string memory _description)
        external
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
        external
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
        external
        view
        onlyRegisteredVoters
        onlyIfVoted(_voterAddress)
        returns (uint256)
    {
        return voterList[_voterAddress].votedProposalId;
    }

    function tallyVotes()
        public
        onlyOwner
        onlyValidWorkflowStatus(WorkflowStatus.VotingSessionEnded)
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
        external
        view
        onlyValidWorkflowStatus(WorkflowStatus.VotesTallied)
        returns (string memory)
    {
        return proposals[winningProposalId].description;
    }
}
