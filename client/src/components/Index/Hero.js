import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import '../../layout/components/hero.sass';

// This isn't really a hero lol
class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenAddress: '',
      timeLimit: '',
      protocolLink: null
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
      this.props.setMessage('Transaction Failed.', receipt.transactionHash);
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
    let link;

    if(this.state.protocolLink) {
      link = <Link to={this.state.protocolLink}>Go to Protocol</Link>
    }

    return (
      <section className="hero">
        <h1 className="hero__header">
          Create a Governance Protocol
        </h1>
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
        {link}
      </section>
    );
  }
}

export default Hero;