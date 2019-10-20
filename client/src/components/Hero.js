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
            timeLeft={proposal.timeLeft}
            setMessage={this.props.setMessage}
            clearMessage={this.props.clearMessage}
          />
        );
      }
    });

    let proposalHeader;
    let resultHeader;

    if(proposals.length > 0) {
      proposalHeader = 'Proposals';
    }

    if(results.length > 0) {
      resultHeader = 'Results';
    }

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
          <h4 className="hero__header">
            {proposalHeader}
          </h4>
          {proposals}
          <h4 className="hero__header">
            {resultHeader}
          </h4>
          {results}
        </div>
      </section>
    );
  }
}

export default Hero;