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
      account: null,
      contract: null,
      proposals: [],
      timeLimit: null
    }

    this.getProposals = this.getProposals.bind(this);
    this.getVoter = this.getVoter.bind(this);
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
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

    this.accountInterval = setInterval(async () => {
      const accounts = await this.state.web3.eth.getAccounts();
      if (accounts[0] !== this.state.account) {
        this.setState({
          account: accounts[0]
        });
      }
    }, 1000);

    this.getVoter();
    this.getTimeLimit();
    this.getProposals();
  };

  componentWillUnmount() {
    clearInterval(this.accountInterval);
  }

  async getVoter() {
    const account = await this.state.accounts[0];
    const voter = await this.state.contract.methods.voters(account).call();
    console.log(voter);
  }

  async getTimeLimit() {
    const timeLimit = await this.state.contract.methods.timeLimit().call();
    this.setState({timeLimit});
  }

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
        voteWeightAgainst: proposal.voteWeightAgainst,
        ended: proposal.ended,
        result: proposal.result
      };
      proposalArr.push(proposalObj);
    }
    this.setState({proposals: proposalArr});
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
          getProposals={this.getProposals}
          delegate={this.delegate}
        />
      </div>
    );
  }
}

export default App;
