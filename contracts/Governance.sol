pragma solidity ^0.5.0;

/// @title Governance Protocol
contract Governance {
    struct Proposal {
        string name; // proposal name
        uint id; // proposal id
        uint voteWeightFor; // vote weight in support
        uint voteWeightAgainst; // vote weight against
        uint startTime; // start time since epoch
        bool result; // result of proposal
        bool resulted; // has someone called the result?
    }

    struct Vote {
        bool support; // if true: for; if false: against
        uint weight; // weight of vote
        bool voted; // has the user voted for this proposal already?
    }

    struct Voter {
        address[] delegatees; // voter that delegated weight to this address
        uint weight; // based on amount of funds locked in contract
        mapping(uint => Vote) votes; // map proposal id to vote
        bool delegated; // has the voter already delegated?
    }

    Proposal[] public proposals;
    mapping(address => Voter) public voters;

    // Next id to be used for proposals
    uint nextId;

    // Time limit to vote on proposals (in seconds)
    uint public timeLimit;

    // Upon contract instantiation, set time limit
    constructor(uint _timeLimit) public {
        timeLimit = _timeLimit;
    }

    // Pick a delegate to pass your voting weight on to
    // Delegated voting power is only used for future votes
    function delegate(address _delegate) public {
        require(voters[msg.sender].delegated == false, 'You can only delegate once.');
        voters[msg.sender].delegated = true;
        voters[_delegate].delegatees.push(msg.sender);
    }

    // Submit a proposal for others to vote on
    function submitProposal(string memory _name) public {
        proposals.push(Proposal({
            result: false,
            name: _name,
            id: nextId,
            voteWeightFor: 0,
            voteWeightAgainst: 0,
            startTime: now,
            resulted: false
        }));
        nextId += 1;
    }

    // Vote for or against a proposal
    function submitVote(uint _proposalId, bool _support) public {
        Vote storage vote = voters[msg.sender].votes[_proposalId];
        // Prevent voter from voting on same proposal more than once
        require(vote.voted == false, 'You have already voted on this proposal.');
        require(proposals[_proposalId].startTime + timeLimit > now, 'The voting period has expired.');

        Voter memory voter = voters[msg.sender];
        require(voters[msg.sender].delegated == false, 'You cannot vote if you have already delegated.');

        if(voter.delegatees.length > 0) {
            uint weight = msg.sender.balance;
            for(uint i = 0; i < voter.delegatees.length; i++) {
                // Only add delegatee weight if they haven't yet voted on this proposal
                if(!voters[voter.delegatees[i]].votes[_proposalId].voted) {
                    weight += voter.delegatees[i].balance;
                }
            }
            voters[msg.sender].weight = weight;
        } else {
            voters[msg.sender].weight = msg.sender.balance;
        }

        vote.voted = true;
        vote.support = _support;

        if(_support == true) {
            proposals[_proposalId].voteWeightFor += voters[msg.sender].weight;
        } else {
            proposals[_proposalId].voteWeightAgainst += voters[msg.sender].weight;
        }
    }

    // Show the result of a proposal
    function result(uint _proposalId) public {
        Proposal memory proposal = proposals[_proposalId];
        // Ensure the proposal duration is complete
        require((proposal.startTime + timeLimit) <= now, 'There is still time left in the proposal.');

        proposals[_proposalId].resulted = true;

        if(proposal.voteWeightFor > proposal.voteWeightAgainst) {
            proposals[_proposalId].result = true;
        }
        // If there is a draw, the proposal is not passed
        if(proposal.voteWeightAgainst >= proposal.voteWeightFor) {
            proposals[_proposalId].result = false;
        }
    }

    function getProposalsLength() public view returns(uint) {
        return proposals.length;
    }
}
