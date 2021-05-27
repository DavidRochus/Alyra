const { BN, ether } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const Voting = artifacts.require("./Voting.sol");

contract("Voting", (accounts) => {
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  const proposal1 = "Proposa1";
  const proposal2 = "Proposa2";

  beforeEach(async function () {
    this.VotingInstance = await Voting.new({ from: owner });
  });

  it("Test Voter Registering", async function () {
    /* Register Voter */
    await this.VotingInstance.registerVoter(voter1, { from: owner });
    await this.VotingInstance.registerVoter(voter2, { from: owner });

    /* Check Voter */
    let voterListAddresses = await this.VotingInstance.getVoterListAddresses();
    let registeredVoter1 = voterListAddresses[0];
    let registeredVoter2 = voterListAddresses[1];
    expect(registeredVoter1).to.equal(voter1);
    expect(registeredVoter2).to.equal(voter2);
  });

  it("Test Proposal Registering", async function () {
    /* Register Voter */
    await this.VotingInstance.registerVoter(voter1, { from: owner });
    await this.VotingInstance.registerVoter(voter2, { from: owner });

    /* Increase Workflow Status */
    await this.VotingInstance.nextWorkflowStatus({ from: owner });

    /* Register Proposal */
    await this.VotingInstance.registerProposal(proposal1, { from: voter1 });
    await this.VotingInstance.registerProposal(proposal2, { from: voter2 });

    /* Check Proposal */
    let registeredProposal1 = await this.VotingInstance.proposals(0, {
      from: owner,
    });
    let registeredProposal2 = await this.VotingInstance.proposals(1, {
      from: owner,
    });
    let registeredProposalDescription1 = registeredProposal1["description"];
    let registeredProposalDescription2 = registeredProposal2["description"];
    expect(registeredProposalDescription1).to.equal(proposal1);
    expect(registeredProposalDescription2).to.equal(proposal2);
  });

  it("Test Proposal Vote", async function () {
    /* Register Voter */
    await this.VotingInstance.registerVoter(voter1, { from: owner });
    await this.VotingInstance.registerVoter(voter2, { from: owner });

    /* Increase Workflow Status */
    await this.VotingInstance.nextWorkflowStatus({ from: owner });

    /* Register Proposal */
    await this.VotingInstance.registerProposal(proposal1, { from: voter1 });
    await this.VotingInstance.registerProposal(proposal2, { from: voter2 });

    /* Increase Workflow Status */
    await this.VotingInstance.nextWorkflowStatus({ from: owner });
    await this.VotingInstance.nextWorkflowStatus({ from: owner });

    /* Vote for Proposal */
    await this.VotingInstance.voteForProposal(0, { from: voter1 });
    await this.VotingInstance.voteForProposal(1, { from: voter2 });

    /* Check Vote (ID) */
    let voteIdFromVoter1 = await this.VotingInstance.getVoteFromVoter(voter1, {
      from: voter1,
    });
    let voteIdFromVoter2 = await this.VotingInstance.getVoteFromVoter(voter2, {
      from: voter2,
    });
    expect(voteIdFromVoter1).to.be.bignumber.equal(new BN(0));
    expect(voteIdFromVoter2).to.be.bignumber.equal(new BN(1));

    /* Check Vote (Decription) */
    let voteFromVoter1 = await this.VotingInstance.proposals(voteIdFromVoter1, {
      from: voter1,
    });
    let voteFromVoter2 = await this.VotingInstance.proposals(voteIdFromVoter2, {
      from: voter2,
    });
    let voteDescriptionFromVoter2 = voteFromVoter2["description"];
    expect(voteDescriptionFromVoter2).to.equal(proposal2);
  });

  it("Test Drawing", async function () {
    /* Register Voter */
    await this.VotingInstance.registerVoter(voter1, { from: owner });
    await this.VotingInstance.registerVoter(voter2, { from: owner });

    /* Increase Workflow Status */
    await this.VotingInstance.nextWorkflowStatus({ from: owner });

    /* Register Proposal */
    await this.VotingInstance.registerProposal(proposal1, { from: voter1 });
    await this.VotingInstance.registerProposal(proposal2, { from: voter2 });

    /* Increase Workflow Status */
    await this.VotingInstance.nextWorkflowStatus({ from: owner });
    await this.VotingInstance.nextWorkflowStatus({ from: owner });

    /* Vote for Proposal */
    await this.VotingInstance.voteForProposal(1, { from: voter1 });
    await this.VotingInstance.voteForProposal(1, { from: voter2 });

    /* Increase Workflow Status */
    await this.VotingInstance.nextWorkflowStatus({ from: owner });
    await this.VotingInstance.nextWorkflowStatus({ from: owner });

    /* Check Winning Proposal */
    let winningProposal = await this.VotingInstance.getWinningProposal({
      from: owner,
    });
    //console.log(await winningProposal);
    expect(winningProposal).to.equal(proposal2);
  });
});
