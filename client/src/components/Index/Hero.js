import React, {Component} from 'react';

import '../../layout/components/hero.sass';

// This isn't really a hero lol
class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenAddress: '',
      timeLimit: ''
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
    ).send({from: this.props.account}, () => {
      this.props.setMessage('Transaction Pending...');
    }).on('confirmation', (number) => {
      if(number === 0) {
        this.props.setMessage('Transaction Confirmed!');
        setTimeout(() => {
          this.props.clearMessage();
        }, 5000);
      }
    }).on('error', () => {
      this.props.setMessage('Transaction Failed.');
      setTimeout(() => {
        this.props.clearMessage();
      });
    });

    const id = await this.props.factory.methods.getLastId().call();
    console.log(id);
  }

  render() {
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
      </section>
    );
  }
}

export default Hero;