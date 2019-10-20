const Governance = artifacts.require('Governance');

contract('Governance', accounts => {
  let governance;

  beforeEach(async () => {
    governance = await Governance.deployed(15);
  });

  it('Should submit proposals', async () => {
    await governance.submitProposal("Dog");
    const proposal = await governance.proposals(0);
    assert(proposal.name === "Dog");
  });

  it('Should allow users to vote for proposals', async () => {
    await governance.submitVote(0, true, {from: accounts[0]});
    const proposal = await governance.proposals(0);
    assert(proposal.voteWeightFor > 0);
  });
});