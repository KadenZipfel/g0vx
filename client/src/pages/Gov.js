import React, { Component } from "react";
import GovernanceFactory from "../contracts/GovernanceFactory.json";
import Governance from "../contracts/Governance.json";
import getWeb3 from "../utils/getWeb3";

import Nav from '../components/Nav';
import Message from '../components/Message';
import ProposalForm from '../components/Gov/ProposalForm';
import Proposal from '../components/Gov/Proposal';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';

import '../layout/config/_base.sass';
import '../layout/components/gov.sass';

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
      timeLimit: null,
      proposals: [],
      error: false,
      txHash: '',
      noProposals: '',
      loading: true
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

    await this.getProtocolAddress();
    await this.getTimeLimit();
    await this.getProposals();
    this.toggleButtons();
    this.getTokenName();
    this.noProposals();
  };
 
  componentWillUnmount() {
    clearInterval(this.accountInterval);
  }

  getProtocolAddress = async () => {
     await this.state.factory.methods.getProtocol(
      this.state.govId
    ).call().then((res) => {
      this.setState({protocolAddress: res});
    });

    const protocol = new this.state.web3.eth.Contract(
      Governance.abi, this.state.protocolAddress
    );
    this.setState({protocol});

    if(this.state.protocolAddress.toString() === '0x0000000000000000000000000000000000000000') {
      this.setState({error: true});
    }
  }

  getTokenName = async () => {
    const tokenAddress = await this.state.protocol.methods.token().call();

    const xhr = new XMLHttpRequest();

    // API must be switched to mainnet in production
    xhr.open('GET', `https://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress=${tokenAddress}&page=1&offset=1`, true);
    xhr.send();

    xhr.onreadystatechange = (e) => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const tokenName = response.result[0].tokenName;
        this.setState({token: tokenName});
      }
    }
  }

  setMessage = (newMessage, txHash) => {
    this.setState({
      message: newMessage,
      txHash
    });
    console.log(this.state.message);
    console.log(this.state.txHash);
  }

  clearMessage = () => {
    this.setState({
      message: null,
      txHash: null
    });
  }

  getProposals = async () => {
    await this.getProtocolAddress();
    const proposalsLength = await this.state.protocol.methods.getProposalsLength().call();
    if(proposalsLength > 0) {
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
          proposalObj.timeLeft = 0;
        } else {
          proposalObj.ended = false;
          // Get time here
          const time = (parseInt(proposalObj.startTime) + parseInt(this.state.timeLimit) - Math.floor(Date.now() / 1000));
          proposalObj.timeLeft = this.formatTime(time);
        }
        proposalArr.push(proposalObj);
      }
      this.setState({proposals: proposalArr});
      this.setState({loading: false});
    } else {
      this.setState({loading: false});
    }
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

  toggleButtons = () => {
    this.state.proposals.forEach(proposal => {
      if(proposal.ended) {
        const proposalButtons = Array.from(document.querySelectorAll(`.proposal__button--${proposal.id}`));
        proposalButtons.forEach((button) => {
          button.classList.add('gone');
        });

        if(proposal.resulted === false) {
          const resultButton = document.querySelector(`.proposal__result--${proposal.id}`);
          if(resultButton) {
            resultButton.classList.remove('hidden');
          }
        }
      }
    });
  }

  getTimeLimit = async () => {
    const timeLimit = await this.state.protocol.methods.timeLimit().call();
    this.setState({timeLimit});
  }

  handleOpenCheck = async () => {
    if(this.state.openCheck === true) {
      await this.setState({openCheck: false});
    }
    else {
      await this.setState({openCheck: true});
    }

    this.toggleButtons();
  }

  handleClosedCheck = async () => {
    if(this.state.closedCheck === true) {
      await this.setState({closedCheck: false});
    }
    else {
      await this.setState({closedCheck: true});
    }

    this.toggleButtons();
  }

  toggleProposalForm = () => {
    const form = document.querySelector('.proposal-form');
    if(form.classList.contains('hidden')) {
      form.classList.remove('hidden');
    } else {
      form.classList.add('hidden');
    }
  }

  noProposals = () => {
    if(this.state.proposals.length === 0) {
      this.setState({noProposals: 'Nothing here yet... Be the first to submit a proposal!'});
    }
  }

  render() {
    let proposals = [];
    let spinner;

    if(this.state.loading === true) {
      spinner = <Spinner />;
    } else {
      spinner = null;
    }

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
              ended={proposal.ended}
              setMessage={this.setMessage}
              clearMessage={this.clearMessage}
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
              ended={proposal.ended}
              resulted={proposal.resulted}
              result={proposal.result}
              setMessage={this.setMessage}
              clearMessage={this.clearMessage}
            />
          );
        }
      }
    });

    if(this.state.error) {
      return (
        <div className="gov">
          <Nav {...this.state} tokenName={this.state.token} />
          <p className="gov__error">Protocol does not exist.</p>
        </div>
      );
    } else {
      return (
        <div>
          <Nav {...this.state} tokenName={this.state.token} />
          <div className="gov">
            <h2 className="gov__header">
              Proposals
            </h2>
            <div className="gov__utils">
              <button 
                className="gov__proposal-button"
                onClick={this.toggleProposalForm}
              >
                Submit a Proposal
              </button>
              <div className="gov__checkboxes">
                <label className="gov__label">
                  Open
                  <input 
                    type="checkbox"
                    className="gov__checkbox"
                    name="open"
                    onChange={this.handleOpenCheck}
                    checked={this.state.openCheck}
                  />
                  <span className="gov__checkmark"></span>
                </label>
                <label className="gov__label">
                  Closed
                  <input 
                    type="checkbox"
                    className="gov__checkbox"
                    name="closed"
                    onChange={this.handleClosedCheck}
                    checked={this.state.closedCheck}
                  />
                  <span className="gov__checkmark"></span>
                </label>
              </div>
            </div>
            <ProposalForm 
              {...this.state}
              getProposals={this.getProposals}
              setMessage={this.setMessage}
              clearMessage={this.clearMessage}
              toggleProposalForm={this.toggleProposalForm}
              noProposals={this.noProposals}
            />
            {this.state.noProposals}
            <div className="gov__proposals">
              {spinner}
              {proposals.reverse()}
            </div>
          </div>
          <Footer />
          <Message />
        </div>
      );
    }
  }
}

export default Gov;
