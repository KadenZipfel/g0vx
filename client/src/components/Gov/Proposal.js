import React, {Component} from 'react';

import Time from './Time';

import '../../layout/components/proposal.sass';

class Proposal extends Component {
  constructor(props) {
    super(props);

    this.handleVoteFor = this.handleVoteFor.bind(this);
    this.handleVoteAgainst = this.handleVoteAgainst.bind(this);
    this.handleResult = this.handleResult.bind(this);
  }

  handleVoteFor() {
    this.props.contract.methods.submitVote(this.props.id, true)
      .send({from: this.props.account}, () => {
        this.props.setMessage('Transaction Pending...');
      }).on('confirmation', (number) => {
        if(number === 0) {
          this.props.setMessage('Transaction Confirmed!');
          this.props.getProposals();
          setTimeout(() => {
            this.props.clearMessage();
          }, 5000);
        }
      }).on('error', () => {
        this.props.setMessage('Transaction Failed.');
        setTimeout(() => {
          this.props.clearMessage();
        });
      });
  }

  handleVoteAgainst() {
    this.props.contract.methods.submitVote(this.props.id, false)
      .send({from: this.props.account}, () => {
        this.props.setMessage('Transaction Pending...');
      }).on('confirmation', (number) => {
        if(number === 0) {
          this.props.setMessage('Transaction Confirmed!');
          this.props.getProposals();
          setTimeout(() => {
            this.props.clearMessage();
          }, 5000);
        }
      }).on('error', () => {
        this.props.setMessage('Transaction Failed.');
        setTimeout(() => {
          this.props.clearMessage();
        });
      });
  }

  handleResult() {
    this.props.protocol.methods.result(this.props.id)
      .send({from: this.props.account}, () => {
        this.props.setMessage('Transaction Pending...');
      }).on('confirmation', (number) => {
        if(number === 0) {
          this.props.setMessage('Transaction Confirmed!');
          this.props.getProposals();
          setTimeout(() => {
            this.props.clearMessage();
          }, 5000);
        }
      }).on('error', () => {
        this.props.setMessage('Transaction Failed.');
        setTimeout(() => {
          this.props.clearMessage();
        });
      });
  }

  render() {
    return (
      <div className="proposal">
        <p className="proposal__name">{this.props.web3.utils.hexToAscii(this.props.title)}</p>
        <p className="proposal__description">{this.props.web3.utils.hexToAscii(this.props.description)}</p>
        <Time timeLeft={this.props.timeLeft} />
        <div className="proposal__weights">
          <p className="proposal__weight">
            {this.props.web3.utils.fromWei(this.props.voteWeightFor)}
          </p>
          <p className="proposal__weight">
            {this.props.web3.utils.fromWei(this.props.voteWeightAgainst)}
          </p>
        </div>
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
            Result
          </button>
        </div>
      </div>
    );
  }
}

export default Proposal;