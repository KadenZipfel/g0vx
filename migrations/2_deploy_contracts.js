var Governance = artifacts.require("./Governance.sol");

module.exports = function(deployer) {
  deployer.deploy(Governance, 60);
};
