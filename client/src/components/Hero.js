import React, {Component} from 'react';

import Proposal from './Proposal';
import Header from './Header';
import ProposalForm from './ProposalForm';

// This isn't really a hero lol
class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposalName: '',
      delegateName: ''
    }

    this.handleDelegateChange = this.handleDelegateChange.bind(this);
    this.handleDelegateSubmit = this.handleDelegateSubmit.bind(this);
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
        <Header />
        <ProposalForm 
          {...this.props}
          getProposals={this.props.getProposals} 
        />
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