import React, {Component} from 'react';

import Proposal from './Proposal';

class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposalName: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({proposalName: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.createProposal(this.state.proposalName);
    this.setState({proposalName: ''});
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
        <form onSubmit={this.handleSubmit}>
          <input 
            type="text" 
            placeholder="Proposal" 
            value={this.state.proposalName}
            onChange={this.handleChange} 
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