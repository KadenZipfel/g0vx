import React, {Component} from 'react';

import '../../layout/components/proposalform.sass';

class ProposalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposalName: '',
      proposalDescription: ''
    }

    this.handleProposalNameChange = this.handleProposalNameChange.bind(this);
    this.handleProposalDescriptionChange = this.handleProposalDescriptionChange.bind(this);
    this.handleProposalSubmit = this.handleProposalSubmit.bind(this);
    this.createProposal = this.createProposal.bind(this);
  }

  handleProposalNameChange(e) {
    this.setState({proposalName: e.target.value});
  }

  handleProposalDescriptionChange(e) {
    this.setState({proposalDescription: e.target.value});
  }

  handleProposalSubmit(e) {
    e.preventDefault();

    this.props.toggleProposalForm();

    this.createProposal(
      // This part is working
      this.props.web3.utils.asciiToHex(this.state.proposalName),
      this.props.web3.utils.asciiToHex(this.state.proposalDescription)
    );
    this.setState({proposalName: '', proposalDescription: ''});
  }

  async createProposal(title, description) {
    await this.props.protocol.methods.submitProposal(title, description)
      .send({from: this.props.account}, (err, transactionHash) => {
        this.props.setMessage('Transaction Pending...', transactionHash);
      }).on('confirmation', (number, receipt) => {
        if(number === 0) {
          this.props.setMessage('Transaction Confirmed!', receipt.transactionHash);
          this.props.getProposals();
          setTimeout(() => {
            this.props.clearMessage();
          }, 5000);
        }
      }).on('error', (error, receipt) => {
        this.props.setMessage('Transaction Failed.', receipt.transactionHash);
      });
  }

  handleProposalFormClick = (e) => {
    const form = document.querySelector('.proposal-form');
    if(e.target === form) {
      this.props.toggleProposalForm();
    }
  }

  render() {
    return(
      <div 
        className="hidden proposal-form"
        onClick={this.handleProposalFormClick}
      >
        <form 
          className="proposal-form__form"
          onSubmit={this.handleProposalSubmit}
        >
          <h4 className="proposal-form__header">
            Submit a Proposal
          </h4>
          <input 
            type="text"
            placeholder="Title"
            value={this.state.proposalName}
            onChange={this.handleProposalNameChange}
            className="proposal-form__input"
          />
          <textarea 
            type="text"
            placeholder="Description (max. 255 chars)"
            value={this.state.proposalDescription}
            onChange={this.handleProposalDescriptionChange} 
            className="proposal-form__textarea"
            maxLength="255"
          ></textarea>
          <button className="proposal-form__button">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default ProposalForm;