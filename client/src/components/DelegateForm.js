import React, {Component} from 'react';

import '../layout/components/delegateform.sass';

class DelegateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delegateName: ''
    }

    this.handleDelegateChange = this.handleDelegateChange.bind(this);
    this.handleDelegateSubmit = this.handleDelegateSubmit.bind(this);
    this.delegate = this.delegate.bind(this);
  }

  handleDelegateChange(e) {
    this.setState({delegateName: e.target.value});
  }

  handleDelegateSubmit(e) {
    e.preventDefault();

    this.delegate(this.state.delegateName);
    this.setState({delegateName: ''});
  }

  async delegate(address) {
    await this.props.contract.methods.delegate(address)
      .send({from: this.props.account}, () => {
        this.props.setMessage('Transaction Pending...');
      }).on('confirmation', () => {
        this.props.setMessage('Transaction Confirmed!');
        setTimeout(() => {
          this.props.clearMessage();
        }, 5000);
      }).on('error', () => {
        this.props.setMessage('Transaction Failed.');
        setTimeout(() => {
          this.props.clearMessage();
        });
      });
  }

  render() {
    return (
      <form 
        className="delegate-form"
        onSubmit={this.handleDelegateSubmit}
      >
        <input 
          type="text"
          placeholder="0x0000000000000000000000000000000000000000"
          value={this.state.delegateName}
          onChange={this.handleDelegateChange} 
          className="delegate-form__input"
        />
        <button className="delegate-form__button">
          Delegate
        </button>
      </form>
    );
  }
}

export default DelegateForm;