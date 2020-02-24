pragma solidity 0.5.8;

import './lib/SafeMath.sol';

interface ERC20 {
    function balanceOf(address guy) external view returns (uint);
}

/// @title Governance Protocol
contract Governance {
    using SafeMath for uint256;

    struct Proposal {
        bytes title; // proposal title
        bytes description; // proposal description
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
        uint weight; // based on amount of funds locked in contract
        mapping(uint => Vote) votes; // map proposal id to vote
    }

    // ERC20 token
    ERC20 public token;

    Proposal[] public proposals;
    mapping(address => Voter) private voters;

    // Next id to be used for proposals
    uint private nextId;

    // Time limit to vote on proposals (in seconds)
    uint public timeLimit;

    // Set time limit and token contract address
    constructor(uint _timeLimit, address _token) public {
        timeLimit = _timeLimit;
        token = ERC20(_token);
    }

    // Submit a proposal for others to vote on
    function submitProposal(bytes memory _title, bytes memory _description) public {
        proposals.push(Proposal({
            result: false,
            title: _title,
            description: _description,
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

        voters[msg.sender].weight = sqrt(token.balanceOf(msg.sender));

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

    // Get the total number of proposals
    function getProposalsLength() public view returns(uint) {
        return proposals.length;
    }

    // Calculate the approximate square root
    function sqrt(uint x) internal pure returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
