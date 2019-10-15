import React, {Component} from 'react';

class ProposalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposalName: ''
    }

    this.handleProposalChange = this.handleProposalChange.bind(this);
    this.handleProposalSubmit = this.handleProposalSubmit.bind(this);
    this.createProposal = this.createProposal.bind(this);
  }

  handleProposalChange(e) {
    this.setState({proposalName: e.target.value});
  }

  handleProposalSubmit(e) {
    e.preventDefault();

    this.createProposal(this.state.proposalName);
    this.setState({proposalName: ''});
  }

  async createProposal(name) {
    await this.props.contract.methods.submitProposal(name)
      .send({from: this.props.account});
    this.props.getProposals();
  }

  render() {
    return(
      <form 
        className="proposal-form"
        onSubmit={this.handleProposalSubmit}
      >
        <input 
          type="text"
          placeholder="Submit a proposal..."
          value={this.state.proposalName}
          onChange={this.handleProposalChange} 
          className="proposal-form__input"
        />
        <button className="proposal-form__button">
          Submit
        </button>
      </form>
    );
  }
}

export default ProposalForm;