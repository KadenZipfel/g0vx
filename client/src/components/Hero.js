import React, {Component} from 'react';

import Proposal from './Proposal';
import Header from './Header';
import ProposalForm from './ProposalForm';
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
            title={proposal.title}
            result={proposal.result}
          />
        );
      } else {
        proposals.push(
          <Proposal 
            {...this.props}
            id={proposal.id} 
            title={proposal.title}
            description={proposal.description} 
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
        <Header token={this.props.token} />
        <div className="hero__forms">
          <ProposalForm 
            {...this.props}
            getProposals={this.props.getProposals} 
            startCountdown={this.startCountdown}
            hasProposalEnded={this.props.hasProposalEnded}
          />
        </div>
        <div className="hero__user">
          <p className="hero__address">
            {this.props.account}
          </p>
          <p className="hero__balance">
            {this.props.balance} {this.props.token}
          </p>
        </div>
        <div>
          <h4 className="hero__header">
            {proposalHeader}
          </h4>
          {proposals.reverse()}
          <h4 className="hero__header">
            {resultHeader}
          </h4>
          {results.reverse()}
        </div>
      </section>
    );
  }
}

export default Hero;