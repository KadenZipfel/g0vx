pragma solidity ^0.5.0;

/// @title Governance Protocol
contract Governance {
    struct Proposal {
        string name; // proposal name
        uint id; // proposal id
        uint voteWeightFor; // vote weight in support
        uint voteWeightAgainst; // vote weight against
        uint startTime; // start time since epoch
    }

    struct Vote {
        bool support; // if true: for; if false: against
        uint weight; // weight of vote
        bool voted; // has the user voted for this proposal already?
    }

    struct Voter {
        address delegatee; // voter that delegated weight to this address
        uint weight; // based on amount of funds locked in contract
        mapping(uint => Vote) votes; // map proposal id to vote
    }

    Proposal[] public proposals;
    mapping(address => Voter) public voters;

    // Time limit to vote on proposals (in seconds)
    uint public timeLimit;

    // Upon contract instantiation, set time limit
    constructor(uint _timeLimit) public {
        timeLimit = _timeLimit;
    }

    // Pick a delegate to pass your voting weight on to
    // Delegated voting power is only used for future votes
    function delegate(address _delegate) public {
        voters[_delegate].delegatee = msg.sender;
    }

    // Submit a proposal for others to vote on
    function submitProposal(string memory _name) public returns(uint) {
        uint _id = proposals.length;

        proposals.push(Proposal({
            name: _name,
            id: _id,
            voteWeightFor: 0,
            voteWeightAgainst: 0,
            startTime: now
        }));

        return _id;
    }

    // Vote for or against a proposal
    function submitVote(uint _proposalId, bool _support) public {
        Vote memory vote = voters[msg.sender].votes[_proposalId];
        // Prevent voter from voting on same proposal more than once
        require(vote.voted == false, 'You have already voted on this proposal.');
        require(proposals[_proposalId].startTime + timeLimit > now, 'The voting period has expired.');

        Voter memory voter = voters[msg.sender];

        voters[msg.sender].weight = msg.sender.balance + voter.delegatee.balance;

        vote.voted = true;
        vote.support = _support;

        if(_support == true) {
            proposals[_proposalId].voteWeightFor += voters[msg.sender].weight;
        } else {
            proposals[_proposalId].voteWeightAgainst += voters[msg.sender].weight;
        }
    }

    // Show the result of a proposal
    function result(uint _proposalId) public view returns(bool) {
        Proposal memory proposal = proposals[_proposalId];
        // Ensure the proposal duration is complete
        require(proposal.startTime + timeLimit <= now, 'There is still time left in the proposal.');
        if(proposal.voteWeightFor > proposal.voteWeightAgainst) {
            return true;
        }
        // If there is a draw, the proposal is not passed
        if(proposal.voteWeightAgainst >= proposal.voteWeightFor) {
            return false;
        }
    }
}
