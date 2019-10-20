import React, { Component } from "react";
import Governance from "./contracts/Governance.json";
import getWeb3 from "./utils/getWeb3";

import Nav from './components/Nav';
import Hero from './components/Hero';
import Message from './components/Message';
import Footer from './components/Footer';

import './layout/config/_base.sass';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      account: null,
      contract: null,
      proposals: [],
      timeLimit: null,
      message: null
    }

    this.getProposals = this.getProposals.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
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

    this.getTimeLimit();
    this.getProposals();
  };

  componentWillUnmount() {
    clearInterval(this.accountInterval);
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
      const proposalObj = {
        id: proposal.id, 
        name: proposal.name,
        startTime: proposal.startTime,
        voteWeightFor: proposal.voteWeightFor,
        voteWeightAgainst: proposal.voteWeightAgainst,
        result: proposal.result,
        resulted: proposal.resulted
      };
      if((parseInt(proposalObj.startTime) + parseInt(this.state.timeLimit)) <= Math.floor(Date.now() / 1000)) {
        proposalObj.ended = true;
        proposalObj.timeLeft = false;
      } else {
        proposalObj.ended = false;
        // Get time here
        const time = (parseInt(proposalObj.startTime) + parseInt(this.state.timeLimit) - Math.floor(Date.now() / 1000));
        proposalObj.timeLeft = this.formatTime(time);
      }
      proposalArr.push(proposalObj);
    }
    this.setState({proposals: proposalArr});
    console.log(this.state.proposals);
    this.toggleButtons();
  }

  toggleButtons() {
    this.state.proposals.forEach(proposal => {
      if(proposal.ended && proposal.resulted === false) {
        const voteButtons = document.querySelectorAll(`.proposal__button--${proposal.id}`);
        const resultButton = document.querySelector(`.proposal__result--${proposal.id}`);

        voteButtons.forEach(button => {
          button.classList.add('hidden');
        });
        resultButton.classList.remove('hidden');
      }
    });
  }

  formatTime(time) {
    const date = new Date(time * 1000);
    const days = date.getUTCDate() - 1;
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getSeconds();
    return {
      days, 
      hours,
      minutes,
      seconds
    }
  }

  setMessage(newMessage) {
    this.setState({
      message: newMessage
    });
    console.log(this.state.message);
  }

  clearMessage() {
    this.setState({
      message: null
    });
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
          toggleButtons={this.toggleButtons}
          hasProposalEnded={this.hasProposalEnded}
          proposalResulted={this.proposalResulted}
          setMessage={this.setMessage}
          clearMessage={this.clearMessage}
        />
        <Message message={this.state.message} />
        <Footer />
      </div>
    );
  }
}

export default App;
