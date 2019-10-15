import React, {Component} from 'react';

import Proposal from './Proposal';
import Header from './Header';
import ProposalForm from './ProposalForm';
import DelegateForm from './DelegateForm';

import '../layout/components/hero.sass';

// This isn't really a hero lol
class Hero extends Component {
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
      <section className="hero">
        <Header />
        <div className="hero__forms">
          <ProposalForm 
            {...this.props}
            getProposals={this.props.getProposals} 
          />
          <DelegateForm
            {...this.props}
            delegate={this.props.delegate}
          />
        </div>
        <div>
          {proposals}
        </div>
      </section>
    );
  }
}

export default Hero;