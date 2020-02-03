import React, {Component} from 'react';

import '../layout/components/proposalform.sass';

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

    console.log(this.props.web3.utils.asciiToHex(this.state.proposalName));

    this.createProposal(
      // This part is working
      this.props.web3.utils.asciiToHex(this.state.proposalName),
      this.props.web3.utils.asciiToHex(this.state.proposalDescription)
    );
    this.setState({proposalName: '', proposalDescription: ''});
  }

  async createProposal(title, description) {
    await this.props.contract.methods.submitProposal(title, description)
      .send({from: this.props.account}, () => {
        this.props.setMessage('Transaction Pending...');
      }).on('confirmation', (number) => {
        if(number === 0) {
          this.props.setMessage('Transaction Confirmed!');
          this.props.getProposals();
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
  }

  render() {
    return(
      <form 
        className="proposal-form"
        onSubmit={this.handleProposalSubmit}
      >
        <input 
          type="text"
          placeholder="Proposal title"
          value={this.state.proposalName}
          onChange={this.handleProposalNameChange}
          className="proposal-form__input"
        />
        <textarea 
          type="text"
          placeholder="Proposal description"
          value={this.state.proposalDescription}
          onChange={this.handleProposalDescriptionChange} 
          className="proposal-form__input"
          maxLength="255"
        ></textarea>
        <button className="proposal-form__button">
          Submit
        </button>
      </form>
    );
  }
}

export default ProposalForm;