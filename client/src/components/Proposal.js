import React, {Component} from 'react';

import Time from './Time';

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
      .send({from: this.props.account})
      .then(() => {
        this.props.getProposals();
      });
  }

  render() {
    return (
      <div className="proposal">
        <p className="proposal__name">{this.props.name}</p>
        <Time timeLeft={this.props.timeLeft} />
        <div className="proposal__buttons">
          <button 
            className={'proposal__button proposal__button--for proposal__button--' + this.props.id}
            onClick={this.handleVoteFor}
          >
            Vote For
          </button>
          <button 
            className={'proposal__button proposal__button--against proposal__button--' + this.props.id}
            onClick={this.handleVoteAgainst}
          >
            Vote Against
          </button>
          <button 
            onClick={this.handleResult}
            className={'hidden proposal__result proposal__result--' + this.props.id}
          >
            Get Result
          </button>
        </div>
      </div>
    );
  }
}

export default Proposal;