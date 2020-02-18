var GovernanceFactory = artifacts.require("./GovernanceFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(GovernanceFactory);
};
