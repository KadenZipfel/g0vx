const Governance = artifacts.require('Governance');
const { expectRevert } = require('openzeppelin-test-helpers');

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

  it('Should prevent users from voting twice on the same proposal', 
    async() => {
      await expectRevert(
        governance.submitVote(0, true, {from: accounts[0]}),
        'You have already voted on this proposal.'
      );
  });
});