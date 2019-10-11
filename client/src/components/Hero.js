import React, {Component} from 'react';

import Proposal from './Proposal';

class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposalName: '',
      delegateName: ''
    }

    this.handleProposalChange = this.handleProposalChange.bind(this);
    this.handleProposalSubmit = this.handleProposalSubmit.bind(this);
    this.handleDelegateChange = this.handleDelegateChange.bind(this);
    this.handleDelegateSubmit = this.handleDelegateSubmit.bind(this);
  }

  handleProposalChange(e) {
    this.setState({proposalName: e.target.value});
  }

  handleProposalSubmit(e) {
    e.preventDefault();

    this.props.createProposal(this.state.proposalName);
    this.setState({proposalName: ''});
  }

  handleDelegateChange(e) {
    this.setState({delegateName: e.target.value});
  }

  handleDelegateSubmit(e) {
    e.preventDefault();

    this.props.delegate(this.state.delegateName);
    this.setState({delegateName: ''});
  }

  render() {
    let proposals = [];
    this.props.proposals.forEach(proposal => {
      proposals.push(
        <Proposal 
          {...this.props}
          id={proposal.id} 
          name={proposal.name} 
          key={proposal.id}
          voteWeightFor={proposal.voteWeightFor} 
          voteWeightAgainst={proposal.voteWeightAgainst}
        />
      );
    });

    return(
      <div>
        <form onSubmit={this.handleProposalSubmit}>
          <input 
            type="text" 
            placeholder="Proposal" 
            value={this.state.proposalName}
            onChange={this.handleProposalChange} 
          />
          <button>Submit</button>
        </form>
        <form onSubmit={this.handleDelegateSubmit}>
          <input 
            type="text" 
            placeholder="Delegate" 
            value={this.state.delegateName}
            onChange={this.handleDelegateChange} 
          />
          <button>Submit</button>
        </form>
        <div>
          {proposals}
        </div>
      </div>
    );
  }
}

export default Hero;