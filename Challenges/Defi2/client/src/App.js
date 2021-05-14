import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import NavBar from "./components/navbar";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    contractOwner: null,
    workflowStatus: null,
    voterlist: null,
    proposallist: null,
    isVoterRegistered: false,
  };

  componentDidMount = async () => {
    console.log("==> componentDidMount");
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runInit);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runInit = async () => {
    console.log("==> runInit", this.state);
    const { accounts, contract } = this.state;
    const contractOwner = await contract.methods.owner().call();
    const workflowStatus = await contract.methods.getWorkflowStatus().call();
    const voterlist = await contract.methods.getVoterListAddresses().call();
    const proposalCount = await contract.methods.getProposalCount().call();
    const isVoterRegistered = await contract.methods
      .isVoterRegistered(accounts[0])
      .call();
    let proposallist = [];
    let winningProposal = null;

    for (let proposalId = 0; proposalId < proposalCount; proposalId++) {
      let proposal = await contract.methods.proposals(proposalId).call();
      proposal["id"] = proposalId;
      console.log("proposal", proposal);
      proposallist.push(proposal);
    }
    console.log("proposallist", proposallist);
    if (workflowStatus >= 5) {
      winningProposal = await contract.methods.getWinningProposal().call();
    }
    this.setState({
      contractOwner: contractOwner,
      proposallist: proposallist,
      voterlist: voterlist,
      workflowStatus: workflowStatus,
      winningProposal: winningProposal,
      isVoterRegistered: isVoterRegistered,
    });
  };

  getWorkflowStatus = async () => {
    console.log("==> getWorkflowStatus");
    const { contract } = this.state;
    const response = await contract.methods.getWorkflowStatus().call();
    this.setState({ workflowStatus: response });
  };

  getRegisterVoterList = async () => {
    console.log("==> getRegisterVoterList");
    const { contract } = this.state;

    // récupérer la liste des comptes autorisés
    const voterlist = await contract.methods.getVoterListAddresses().call();
    // Mettre à jour le state
    this.setState({ voterlist: voterlist });
  };

  getRegisterProposalList = async () => {
    console.log("==> getRegisterProposalList");
    const { contract } = this.state;
    const proposalCount = await contract.methods.getProposalCount().call();

    let proposallist = [];
    for (let proposalId = 0; proposalId < proposalCount; proposalId++) {
      let proposal = await contract.methods.proposals(proposalId).call();
      proposal["id"] = proposalId;
      console.log("proposal", proposal);
      proposallist.push(proposal);
    }
    console.log("proposallist", proposallist);

    this.setState({ proposallist: proposallist });
  };

  handleIncrementWorkflow = async () => {
    console.log("Incrementing Workflow");
    const { accounts, contract } = this.state;
    await contract.methods.nextWorkflowStatus().send({ from: accounts[0] });
    //this.getWorkflowStatus();
    this.runInit();
  };

  handleRegisterVoter = async () => {
    const { accounts, contract } = this.state;
    const address = this.address.value;
    await contract.methods.registerVoter(address).send({ from: accounts[0] });
    this.address.value = null;
    this.getRegisterVoterList();
  };

  handleRegisterProposal = async () => {
    const { accounts, contract } = this.state;
    const proposal = this.proposal.value;
    await contract.methods
      .registerProposal(proposal)
      .send({ from: accounts[0] });
    this.proposal.value = null;
    this.getRegisterProposalList();
  };

  handleVoteForProposal = async (voteId) => {
    console.log("handleVoteForProposal", voteId);
    const { accounts, contract } = this.state;
    await contract.methods.voteForProposal(voteId).send({ from: accounts[0] });
    this.getRegisterProposalList();
  };

  renderWorkflowStatus() {
    console.log("==> renderWorkflowStatus", this.state.workflowStatus);
    if (this.state.workflowStatus == 0) {
      return (
        <h1>
          <strong>Status: </strong>Registering voters... (
          {this.state.workflowStatus})
        </h1>
      );
    } else if (this.state.workflowStatus == 1) {
      return (
        <h1>
          <strong>Status: </strong>Proposal registration ongoing... (
          {this.state.workflowStatus})
        </h1>
      );
    } else if (this.state.workflowStatus == 2) {
      return (
        <h1>
          <strong>Status: </strong>Proposal registration ended... (
          {this.state.workflowStatus})
        </h1>
      );
    } else if (this.state.workflowStatus == 3) {
      return (
        <h1>
          <strong>Status: </strong>Voting session ongoing... (
          {this.state.workflowStatus})
        </h1>
      );
    } else if (this.state.workflowStatus == 4) {
      return (
        <h1>
          <strong>Status: </strong>Voting session ended... (
          {this.state.workflowStatus})
        </h1>
      );
    } else if (this.state.workflowStatus == 5) {
      return (
        <h1>
          <strong>Status: </strong>Votes tallied... ({this.state.workflowStatus}
          )
        </h1>
      );
    } else {
      return (
        <h1>
          <strong>Status: </strong>Unknown Workflow Status (
          {this.state.workflowStatus})
        </h1>
      );
    }
  }

  renderWorkflowContent() {
    console.log("==> renderWorkflowContent");
    if (this.state.workflowStatus == 0) {
      return [this.renderRegisterVoterAdd(), this.renderRegisterVoterList()];
    } else if (this.state.workflowStatus == 1) {
      return [
        this.renderProposalRegistrationAdd(),
        this.renderProposalRegistrationList(),
        this.renderRegisterVoterList(),
      ];
    } else if (
      this.state.workflowStatus == 2 ||
      this.state.workflowStatus == 3 ||
      this.state.workflowStatus == 4
    ) {
      return [
        this.renderProposalRegistrationList(),
        this.renderRegisterVoterList(),
      ];
    } else if (this.state.workflowStatus == 5) {
      return [
        this.renderWinningProposal(),
        this.renderProposalRegistrationList(),
        this.renderRegisterVoterList(),
      ];
    } else {
      return <h3>Unknown Workflow Status ({this.state.workflowStatus})</h3>;
    }
  }

  renderRegisterVoterAdd() {
    console.log("==> renderRegisterVoterAdd");
    if (this.state.accounts[0] === this.state.contractOwner) {
      return (
        <React.Fragment>
          <br></br>
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="card text-center">
                <div className="card-header">
                  <strong>Add a new Voter</strong>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <input
                      type="text"
                      id="address"
                      className="form-control"
                      ref={(input) => {
                        this.address = input;
                      }}
                    ></input>
                  </div>
                  <br></br>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={this.handleRegisterVoter}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          <br></br>
        </React.Fragment>
      );
    } else {
      return;
    }
  }

  renderRegisterVoterList() {
    console.log("==> renderRegisterVoterList");
    const { voterlist } = this.state;
    return (
      <React.Fragment>
        <br></br>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card text-center">
              <div className="card-header">
                <strong>Registered Voters</strong>
              </div>
              <div className="card-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voterlist !== null &&
                      voterlist.map((a) => (
                        <tr>
                          <td>{a}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderProposalRegistrationAdd() {
    console.log("==> renderProposalRegistrationAdd");
    if (this.state.isVoterRegistered) {
      return (
        <React.Fragment>
          <br></br>
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="card text-center">
                <div className="card-header">
                  <strong>Add a new proposal</strong>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <input
                      type="text"
                      id="proposal"
                      className="form-control"
                      ref={(input) => {
                        this.proposal = input;
                      }}
                    ></input>
                  </div>
                  <br></br>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={this.handleRegisterProposal}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          <br></br>
        </React.Fragment>
      );
    } else {
      return;
    }
  }

  renderProposalRegistrationList() {
    console.log("==> renderProposalRegistrationList");
    const { workflowStatus, proposallist, isVoterRegistered } = this.state;
    return (
      <React.Fragment>
        <br></br>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card text-center">
              <div className="card-header">
                <strong>Proposals</strong>
              </div>
              <div className="card-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Description</th>
                      {workflowStatus >= 3 && <th scope="col">Votes</th>}
                      {workflowStatus == 3 && isVoterRegistered && (
                        <th scope="col">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {proposallist !== null &&
                      proposallist.map((a) => (
                        <tr>
                          <td>{a["id"]}</td>
                          <td>{a["description"]}</td>
                          {workflowStatus >= 3 && <td>{a["voteCount"]}</td>}
                          {workflowStatus == 3 && isVoterRegistered && (
                            <td>
                              <a
                                href="#"
                                className="btn btn-primary"
                                onClick={() =>
                                  this.handleVoteForProposal(a["id"])
                                }
                              >
                                Vote
                              </a>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderWinningProposal() {
    console.log("==> renderWinningProposal");
    return (
      <React.Fragment>
        <br></br>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card text-center">
              <div className="card-header">
                <strong>Winning Proposal</strong>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <div className="alert alert-success" role="alert">
                    <div>{this.state.winningProposal}</div>
                  </div>
                </div>
                <br></br>
              </div>
            </div>
          </div>
        </div>
        <br></br>
      </React.Fragment>
    );
  }

  render() {
    console.log("==> render");
    if (!this.state.web3 || !this.state.workflowStatus) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <React.Fragment>
        <NavBar
          contractOwner={this.state.contractOwner}
          onIncrementWorkflow={this.handleIncrementWorkflow}
          workflowStatus={this.state.workflowStatus}
          userAccount={this.state.accounts[0]}
        />
        <main className="container">
          <div className="row">
            <div className="col-8 offset-2 text-center">
              <br></br>
              {this.renderWorkflowStatus()}
            </div>
          </div>
          <br></br>
          {this.renderWorkflowContent()}
          <br></br>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
