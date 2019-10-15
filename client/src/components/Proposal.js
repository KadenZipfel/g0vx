import React, {Component} from 'react';

import '../layout/components/proposal.sass';

class Proposal extends Component {
  constructor(props) {
    super(props);

    this.handleVoteFor = this.handleVoteFor.bind(this);
    this.handleVoteAgainst = this.handleVoteAgainst.bind(this);
    this.handleResult = this.handleResult.bind(this);
  }

  handleVoteFor() {
    this.props.contract.methods.submitVote(this.props.id, true)
      .send({from: this.props.account})
      .then(() => {
        this.props.getProposals();
      });
  }

  handleVoteAgainst() {
    this.props.contract.methods.submitVote(this.props.id, false)
      .send({from: this.props.account})
      .then(() => {
        this.props.getProposals();
      });
  }

  handleResult() {
    this.props.contract.methods.result(this.props.id)
      .call((err, result) => {
        console.log(result);
      });
  }

  render() {
    return (
      <div className="proposal">
        <p className="proposal__name">{this.props.name}</p>
        <div className="proposal__buttons">
          <button 
            className="proposal__button proposal__button--for" 
            onClick={this.handleVoteFor}
          >
            Vote For
          </button>
          <button 
            className="proposal__button proposal__button--against" 
            onClick={this.handleVoteAgainst}
          >
            Vote Against
          </button>
        </div>
      </div>
    );
  }
}

export default Proposal;