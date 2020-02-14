import React, { Component } from "react";
import GovernanceFactory from "../contracts/GovernanceFactory.json";
import getWeb3 from "../utils/getWeb3";

import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Message from '../components/Message';

import '../layout/config/_base.sass';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      account: null,
      factory: null,
      message: null
    }

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
      const deployedNetwork = GovernanceFactory.networks[networkId];
      const instance = new web3.eth.Contract(
        GovernanceFactory.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, factory: instance }, this.runExample)
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
  };

  componentWillUnmount() {
    clearInterval(this.accountInterval);
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
    return (
      <div>
        <Nav />
        <Hero 
          {...this.state}
          setMessage={this.setMessage}
          clearMessage={this.clearMessage}
        />
        <Message />
      </div>
    );
  }
}

export default Index;