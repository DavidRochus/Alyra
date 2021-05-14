import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

class NavBar extends Component {
  //state = {  }

  renderWorkflowManager() {
    console.log("==> renderWorkflowManager");
    if (this.props.userAccount === this.props.contractOwner) {
      if (this.props.workflowStatus == 0) {
        return (
          <button
            onClick={this.props.onIncrementWorkflow}
            type="button"
            className="btn btn-danger"
          >
            Start proposals registrations
          </button>
        );
      } else if (this.props.workflowStatus == 1) {
        return (
          <button
            onClick={this.props.onIncrementWorkflow}
            type="button"
            className="btn btn-danger"
          >
            End proposals registrations
          </button>
        );
      } else if (this.props.workflowStatus == 2) {
        return (
          <button
            onClick={this.props.onIncrementWorkflow}
            type="button"
            className="btn btn-danger"
          >
            Start Voting session
          </button>
        );
      } else if (this.props.workflowStatus == 3) {
        return (
          <button
            onClick={this.props.onIncrementWorkflow}
            type="button"
            className="btn btn-danger"
          >
            End Voting session
          </button>
        );
      } else if (this.props.workflowStatus == 4) {
        return (
          <button
            onClick={this.props.onIncrementWorkflow}
            type="button"
            className="btn btn-danger"
          >
            Tally Votes
          </button>
        );
      }
    }
  }

  renderUserAccount() {
    if (this.props.userAccount === this.props.contractOwner) {
      return (
        <span className="badge rounded-pill bg-danger">
          {this.props.userAccount.substring(0, 5) +
            "..." +
            this.props.userAccount.substring(
              this.props.userAccount.length - 3,
              this.props.userAccount.length
            )}
        </span>
      );
    } else {
      return (
        <span className="badge rounded-pill bg-primary">
          {this.props.userAccount.substring(0, 5) +
            "..." +
            this.props.userAccount.substring(
              this.props.userAccount.length - 3,
              this.props.userAccount.length
            )}
        </span>
      );
    }
  }

  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <strong>Voting Dapp</strong>
          </span>
          {this.renderWorkflowManager()}
          {this.renderUserAccount()}
        </div>
      </nav>
    );
  }
}

export default NavBar;
