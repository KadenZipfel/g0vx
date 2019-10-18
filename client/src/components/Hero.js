import React, {Component} from 'react';

import Proposal from './Proposal';
import Header from './Header';
import ProposalForm from './ProposalForm';
import DelegateForm from './DelegateForm';
import Result from './Result';

import '../layout/components/hero.sass';

// This isn't really a hero lol
class Hero extends Component {
  render() {
    let proposals = [];
    let results = [];
    this.props.proposals.forEach(proposal => {
      if(proposal.resulted === true) {
        results.push(
          <Result
            id={proposal.id}
            key={proposal.id}
            name={proposal.name}
            result={proposal.result}
          />
        );
      } else {
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
      }
    });

    return(
      <section className="hero">
        <Header />
        <div className="hero__forms">
          <ProposalForm 
            {...this.props}
            getProposals={this.props.getProposals} 
            startCountdown={this.startCountdown}
            hasProposalEnded={this.props.hasProposalEnded}
          />
          <DelegateForm
            {...this.props}
            delegate={this.props.delegate}
          />
        </div>
        <div>
          {proposals}
          {results}
        </div>
      </section>
    );
  }
}

export default Hero;