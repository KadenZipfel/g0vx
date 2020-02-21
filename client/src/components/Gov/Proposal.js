import React, {Component} from 'react';

import Time from './Time';

import '../../layout/components/proposal.sass';
import upvote from '../../images/upvote.svg'
import downvote from '../../images/downvote.svg'

class Proposal extends Component {
  constructor(props) {
    super(props);

    this.handleVoteFor = this.handleVoteFor.bind(this);
    this.handleVoteAgainst = this.handleVoteAgainst.bind(this);
    this.handleResult = this.handleResult.bind(this);

    let result;
    this.getResult();
  }

  handleVoteFor() {
    this.props.protocol.methods.submitVote(this.props.id, true)
      .send({from: this.props.account}, (err, transactionHash) => {
        this.props.setMessage('Transaction Pending...', transactionHash);
      }).on('confirmation', (number, receipt) => {
        if(number === 0) {
          this.props.setMessage('Transaction Confirmed!', receipt.transactionHash);
          setTimeout(() => {
            this.props.clearMessage();
          }, 5000);
          this.props.getProposals();
        }
      }).on('error', (err, receipt) => {
        this.props.setMessage('Transaction Failed.', receipt ? receipt.transactionHash : null);
      });
  }

  handleVoteAgainst() {
    this.props.protocol.methods.submitVote(this.props.id, false)
      .send({from: this.props.account}, (err, transactionHash) => {
        this.props.setMessage('Transaction Pending...', transactionHash);
      }).on('confirmation', (number, receipt) => {
        if(number === 0) {
          this.props.setMessage('Transaction Confirmed!', receipt.transactionHash);
          setTimeout(() => {
            this.props.clearMessage();
          }, 5000);
          this.props.getProposals();
        }
      }).on('error', (err, receipt) => {
        this.props.setMessage('Transaction Failed.', receipt ? receipt.transactionHash : null);
      });
  }

  handleResult() {
    this.props.protocol.methods.result(this.props.id)
      .send({from: this.props.account}, (err, transactionHash) => {
        this.props.setMessage('Transaction Pending...', transactionHash);
      }).on('confirmation', (number, receipt) => {
        if(number === 0) {
          this.props.setMessage('Transaction Confirmed!', receipt.transactionHash);
          setTimeout(() => {
            this.props.clearMessage();
          }, 5000);
          this.props.getProposals();
        }
      }).on('error', (err, receipt) => {
        this.props.setMessage('Transaction Failed.', receipt ? receipt.transactionHash : null);
      });
  }

  getResult() {
    if(this.props.resulted) {
      console.log('Resulted');
      console.log('Result: ', this.props.result);
      this.props.result === true ? this.result = 'Passed' : this.result = 'Failed';
    }
  }

  render() {
    return (
      <div className="proposal">
        <div className="proposal__buttons">
          <img 
            src={upvote} 
            alt="upvote"
            className={'proposal__button proposal__button--for proposal__button--' + this.props.id}
            onClick={this.handleVoteFor} 
          />
          <img 
            src={downvote} 
            alt="downvote"
            className={'proposal__button proposal__button--against proposal__button--' + this.props.id}
            onClick={this.handleVoteAgainst} 
          />
        </div>
        <div className="proposal__info">
          <p className="proposal__name">{this.props.web3.utils.hexToAscii(this.props.title)}</p>
          <p className="proposal__description">{this.props.web3.utils.hexToAscii(this.props.description)}</p>
        </div>
        <p 
          onClick={this.handleResult}
          className={'hidden proposal__result proposal__result--' + this.props.id}
        >
          Show Results
        </p>
        <Time timeLeft={this.props.timeLeft} />
        <p className="proposal__results">
          {this.result}
        </p>
      </div>
    );
  }
}

export default Proposal;