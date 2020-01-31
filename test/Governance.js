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

  it('Should not return result before time is up', async () => {
    await expectRevert(
      governance.result(0, {from: accounts[0]}),
      'There is still time left in the proposal.'
    );
  });

  it('Should not allow user to vote after time is up', async () => {
    // 16 second timeout to wait for 15 second time limit
    setTimeout(async () => {
      await expectRevert(
        governance.submitVote(0, true, {from: accounts[4]}),
        'The voting period has expired.'
      );
    }, 16000);
  });
});