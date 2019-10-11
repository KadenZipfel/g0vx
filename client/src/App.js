import React, { Component } from "react";
import Governance from "./contracts/Governance.json";
import getWeb3 from "./utils/getWeb3";

import Nav from './components/Nav';
import Hero from './components/Hero';

import './layout/config/_base.sass';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      proposals: []
    }

    this.getProposals = this.getProposals.bind(this);
    this.createProposal = this.createProposal.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Governance.networks[networkId];
      const instance = new web3.eth.Contract(
        Governance.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample)
      
      this.getProposals();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // Finish this once we can create proposals
  async getProposals() {
    const proposalsLength = await this.state.contract.methods.getProposalsLength().call();
    let proposalArr = [];
    for(let i = 0; i < proposalsLength; i++) {
      const proposal = await this.state.contract.methods.proposals(i).call();
      console.log(proposal);
      const proposalObj = {
        id: proposal.id, 
        name: proposal.name,
        timeLimit: proposal.timeLimit,
        voteWeightFor: proposal.voteWeightFor,
        voteWeightAgainst: proposal.voteWeightAgainst
      };
      proposalArr.push(proposalObj);
    }
    this.setState({proposals: proposalArr});
  }

  async createProposal(name) {
    await this.state.contract.methods.submitProposal(name)
      .send({from: this.state.accounts[0]})
    this.getProposals();
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <Nav />
        <Hero 
          {...this.state} 
          createProposal={this.createProposal}
          getProposals={this.getProposals}
        />
      </div>
    );
  }
}

export default App;
