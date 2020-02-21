import React, {Component} from 'react';

import '../../layout/components/hero.sass';

// This isn't really a hero lol
class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenAddress: '',
      timeLimit: '',
      protocolLink: null,
      error: null
    }
  }

  handleAddressChange = (e) => {
    this.setState({tokenAddress: e.target.value})
  }

  handleTimeLimitChange = (e) => {
    this.setState({timeLimit: e.target.value})
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    if(!this.props.web3.utils.isAddress(this.state.tokenAddress)) {
      return this.setState({error: 'Invalid token address'});
    } else {
      this.setState({error: null});
    }

    await this.props.factory.methods.createProtocol(
      this.state.timeLimit, 
      this.state.tokenAddress
    ).send({from: this.props.account}, (err, transactionHash) => {
      this.props.setMessage('Transaction Pending...', transactionHash);
    }).on('confirmation', (number, receipt) => {
      if(number === 0) {
        this.props.setMessage('Transaction Confirmed!', receipt.transactionHash);
        setTimeout(() => {
          this.props.clearMessage();
        }, 5000);
      }
    }).on('error', (error, receipt) => {
      this.props.setMessage('Transaction Failed.', receipt ? receipt.transactionHash : null);
    });

    this.props.factory.methods.getLastId().call((err, res) => {
      if(err) {
        console.log(err);
      } else {
        const link = `/gov/${res}`;
        this.setState({protocolLink: link});
      }
    });
  }

  render() {
    if(this.state.protocolLink) {
      return (
        <section className="hero">
          <a href={this.state.protocolLink} className="hero__link">Go to Protocol</a>
        </section>
      );
    } else {
      return (
        <section className="hero">
          <h1 className="hero__header">
            Create a Governance Protocol
          </h1>
          <p className="hero__error">
            {this.state.error}
          </p>
          <form 
            onSubmit={this.handleSubmit}
            className="hero__form"
          >
            <input
              name="address"
              placeholder="Token address"
              type="text"
              className="hero__input"
              onChange={this.handleAddressChange}
              value={this.state.tokenAddress}
            />
            <input 
              name="timeLimit"
              placeholder="Proposal time limit (seconds)"
              type="number"
              className="hero__input"
              onChange={this.handleTimeLimitChange}
              value={this.state.timeLimit}
            />
            <button className="hero__button">
              Create Governance
            </button>
          </form>
          <p className="hero__flex">
            {this.props.numProtocols} governance protocols deployed with g0vx
          </p>
        </section>
      );
    }
  }
}

export default Hero;