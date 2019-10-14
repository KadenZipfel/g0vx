import React, {Component} from 'react';

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
      <div>
        <p>id: {this.props.id}</p>
        <p>name: {this.props.name}</p>
        <p>for: {this.props.web3.utils.fromWei(this.props.voteWeightFor, 'ether')}</p>
        <p>against: {this.props.web3.utils.fromWei(this.props.voteWeightAgainst, 'ether')}</p>
        <button onClick={this.handleVoteFor}>Vote For</button>
        <button onClick={this.handleVoteAgainst}>Vote Against</button>
        <button onClick={this.handleResult}>Result</button>
      </div>
    );
  }
}

export default Proposal;