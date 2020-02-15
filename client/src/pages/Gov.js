import React, { Component } from "react";
import GovernanceFactory from "../contracts/GovernanceFactory.json";
import Governance from "../contracts/Governance.json";
import getWeb3 from "../utils/getWeb3";

import Nav from '../components/Nav';
import Message from '../components/Message';
import ProposalForm from '../components/Gov/ProposalForm';
import Proposal from '../components/Gov/Proposal';

import '../layout/config/_base.sass';

class Gov extends Component {
  constructor(props) {
    super(props);
    this.state = {
      govId: null,
      web3: null,
      account: null,
      factory: null,
      message: null,
      protocolAddress: null,
      protocol: null,
      token: null,
      openCheck: true,
      closedCheck: false,
      proposals: []
    }
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
      const factory = new web3.eth.Contract(
        GovernanceFactory.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const id = this.props.match.params.govId;

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, factory: factory, govId: id }, this.runExample)
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

    this.getProtocolAddress();
  };
 
  componentWillUnmount() {
    clearInterval(this.accountInterval);
  }

  getProtocolAddress = () => {
    this.state.factory.methods.getProtocol(
      this.state.govId
    ).call().then((res) => {
      this.setState({protocolAddress: res});
    }).then(() => {
      const protocol = new this.state.web3.eth.Contract(
        Governance.abi, this.state.protocolAddress
      );
      this.setState({protocol});
    }).then(() => {
      if(this.state.protocolAddress.toString() === '0x0000000000000000000000000000000000000000') {
        return console.log("Protocol does not exist.");
      } else {
        this.getProposals();
      }
    });
  }

  getTokenName = async () => {
    const tokenAddress = await this.state.contract.methods.token().call();

    const xhr = new XMLHttpRequest();

    xhr.open('GET', `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${tokenAddress}&page=1&offset=1`, true);
    xhr.send();

    xhr.onreadystatechange = (e) => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const tokenName = response.result[0].tokenName;
        this.setState({token: tokenName});
      }
    }
  }

  setMessage = (newMessage) => {
    this.setState({
      message: newMessage
    });
    console.log(this.state.message);
  }

  clearMessage = () => {
    this.setState({
      message: null
    });
  }

  async getProposals() {
    const proposalsLength = await this.state.protocol.methods.getProposalsLength().call();
    let proposalArr = [];
    for(let i = 0; i < proposalsLength; i++) {
      const proposal = await this.state.protocol.methods.proposals(i).call();
      const proposalObj = {
        id: proposal.id, 
        title: proposal.title,
        description: proposal.description,
        startTime: proposal.startTime,
        voteWeightFor: proposal.voteWeightFor,
        voteWeightAgainst: proposal.voteWeightAgainst,
        result: proposal.result,
        resulted: proposal.resulted
      };
      console.log(proposalObj);
      if((parseInt(proposalObj.startTime) + parseInt(this.state.timeLimit)) <= Math.floor(Date.now() / 1000)) {
        proposalObj.ended = true;
        proposalObj.timeLeft = false;
      } else {
        proposalObj.ended = false;
        // Get time here
        // const time = (parseInt(proposalObj.startTime) + parseInt(this.state.timeLimit) - Math.floor(Date.now() / 1000));
        // proposalObj.timeLeft = this.formatTime(time);
      }
      proposalArr.push(proposalObj);
    }
    this.setState({proposals: proposalArr});
    // this.toggleButtons();
  }

  handleOpenCheck = () => {
    if(this.state.openCheck === true) {
      this.setState({openCheck: false});
    }
    else {
      this.setState({openCheck: true});
    }
  }

  handleClosedCheck = () => {
    if(this.state.closedCheck === true) {
      this.setState({closedCheck: false});
    }
    else {
      this.setState({closedCheck: true});
    }
  }

  render() {
    let proposals = [];
    this.state.proposals.forEach(proposal => {
      if(this.state.openCheck === true) {
        if(proposal.resulted === false) {
          proposals.push(
            <Proposal 
              {...this.state}
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
      }
      if(this.state.closedCheck === true) {
        if(proposal.resulted === true) {
          proposals.push(
            <Proposal 
              {...this.state}
              id={proposal.id} 
              title={proposal.title}
              description={proposal.description} 
              key={proposal.id}
              voteWeightFor={proposal.voteWeightFor} 
              voteWeightAgainst={proposal.voteWeightAgainst}
              timeLeft={proposal.timeLeft}
              setMessage={this.setMessage}
              clearMessage={this.clearMessage}
            />
          );
        }
      }
    });

    return (
      <div>
        <Nav tokenName={this.state.token} />
        <ProposalForm 
          {...this.state}
          getProposals={this.getProposals}
          setMessage={this.setMessage}
          clearMessage={this.clearMessage}
        />
        <div className="gov__checkboxes">
          <p className="gov__label">
            Open
          </p>
          <input 
            type="checkbox"
            className="gov__checkbox"
            name="open"
            onChange={this.handleOpenCheck}
            checked={this.state.openCheck}
          />
          <p className="gov__label">
            Closed
          </p>
          <input 
            type="checkbox"
            className="gov__checkbox"
            name="closed"
            onChange={this.handleClosedCheck}
            checked={this.state.closedCheck}
          />
        </div>
        {proposals}
        <Message />
      </div>
    );
  }
}

export default Gov;
