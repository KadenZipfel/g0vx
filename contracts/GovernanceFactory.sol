pragma solidity 0.5.8;

import './Governance.sol';

contract GovernanceFactory {
  mapping(uint => address) protocols;
  uint nextId;

  function createProtocol(uint _timeLimit, address _token) public {
    require(protocols[nextId] == address(0), 'id already in use');
    Governance protocol = new Governance(_timeLimit, _token);
    protocols[nextId] = address(protocol);
    nextId++;
  }

  function getLastId() public view returns(uint) {
    uint id = nextId - 1;
    return id;
  }

  function getProtocol(uint _id) public view returns(address) {
    return protocols[_id];
  }
}