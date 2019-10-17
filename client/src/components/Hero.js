import React, {Component} from 'react';

import Proposal from './Proposal';
import Header from './Header';
import ProposalForm from './ProposalForm';
import DelegateForm from './DelegateForm';
import Result from './Result';

import '../layout/components/hero.sass';

// This isn't really a hero lol
class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    }

    this.startCountdown = this.startCountdown.bind(this);
  }

  async startCountdown(id) {
    const time = (parseInt(this.props.timeLimit) + 15) * 1000
    setTimeout(() => {
      // Switch buttons
      this.props.toggleButtons(id);
    }, time);
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

    let results = [];
    this.state.results.forEach(result => {
      results.push(
        <Result
          id={result.id}
          key={result.id}
          name={result.name}
          result={result.result}
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
            startCountdown={this.startCountdown}
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