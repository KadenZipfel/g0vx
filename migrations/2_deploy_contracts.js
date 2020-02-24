var GovernanceFactory = artifacts.require("./GovernanceFactory.sol");
var Governance = artifacts.require("./Governance.sol");

module.exports = function(deployer) {
  deployer.deploy(GovernanceFactory);
  deployer.deploy(Governance, 0, '0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA');
};
