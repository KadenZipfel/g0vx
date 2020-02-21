import React, {Component} from 'react';

import Time from './Time';

import '../../layout/components/proposal.sass';
import upvote from '../../images/upvote.svg'
import downvote from '../../images/downvote.svg'

class Proposal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null
    }

    this.handleVoteFor = this.handleVoteFor.bind(this);
    this.handleVoteAgainst = this.handleVoteAgainst.bind(this);
    this.handleResult = this.handleResult.bind(this);

    this.handleClosedProposals();
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

  handleClosedProposals = () => {
    if(this.props.resulted === true) {
      this.setState({result: this.props.result});
    }
  }

  render() {
    let result;

    if(this.state.result === true) {
      result = 'Passed';  
    } else {
      result = 'Failed';
    }

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
        <button 
          onClick={this.handleResult}
          className={'hidden proposal__result proposal__result--' + this.props.id}
        >
          Show Results
        </button>
        <Time timeLeft={this.props.timeLeft} />
        <p className="proposal__results">
          {result}
        </p>
      </div>
    );
  }
}

export default Proposal;