import React, {Component} from 'react';

class Proposal extends Component {
  constructor(props) {
    super(props);

    this.handleVoteFor = this.handleVoteFor.bind(this);
    this.handleVoteAgainst = this.handleVoteAgainst.bind(this);
  }

  handleVoteFor() {
    this.props.contract.methods.submitVote(this.props.id, true)
      .send({from: this.props.accounts[0]})
      .then(() => {
        this.props.getProposals();
      });
  }

  handleVoteAgainst() {
    this.props.contract.methods.submitVote(this.props.id, false)
      .send({from: this.props.accounts[0]})
      .then(() => {
        this.props.getProposals();
      });
  }

  render() {
    return (
      <div>
        <p>id: {this.props.id}</p>
        <p>name: {this.props.name}</p>
        <p>for: {this.props.voteWeightFor}</p>
        <p>against: {this.props.voteWeightAgainst}</p>
        <button onClick={this.handleVoteFor}>Vote For</button>
        <button onClick={this.handleVoteAgainst}>Vote Against</button>
      </div>
    );
  }
}

export default Proposal;