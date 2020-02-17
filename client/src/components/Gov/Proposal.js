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
  }

  handleVoteFor() {
    this.props.protocol.methods.submitVote(this.props.id, true)
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
    this.props.protocol.methods.submitVote(this.props.id, false)
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
        {/* <div className="proposal__weights">
          <p className="proposal__weight">
            {this.props.web3.utils.fromWei(this.props.voteWeightFor)}
          </p>
          <p className="proposal__weight">
            {this.props.web3.utils.fromWei(this.props.voteWeightAgainst)}
          </p>
        </div> */}
      </div>
    );
  }
}

export default Proposal;