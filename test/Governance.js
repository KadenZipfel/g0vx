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

  it('Should allow users to vote against proposals', async () => {
    await governance.submitVote(0, false, {from: accounts[1]});
    const proposal = await governance.proposals(0);
    assert(proposal.voteWeightAgainst > 0);
  });

  it('Should properly delegate', async () => {
    await governance.delegate(accounts[3], {from: accounts[2]});
    await governance.submitProposal("Cat");
    await governance.submitVote(1, true, {from: accounts[3]});
    const proposal = await governance.proposals(1);
    assert(proposal.voteWeightFor > 100000000000000000000);
  });

  it('Should not allow same account to delegate twice', async () => {
    await expectRevert(
      governance.delegate(accounts[4], {from: accounts[2]}),
      'You can only delegate once.'
    );
  });

  it('Should not allow user to vote after delegating', async () => {
    await expectRevert(
      governance.submitVote(0, true, {from: accounts[2]}),
      'You cannot vote if you have already delegated.'
    );
  });

  it('Should not return result before time is up', async () => {
    await expectRevert(
      governance.result(0, {from: accounts[0]}),
      'There is still time left in the proposal.'
    );
  });
});