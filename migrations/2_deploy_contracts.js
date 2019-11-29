var Governance = artifacts.require("./Governance.sol");

module.exports = function(deployer) {
  deployer.deploy(Governance, 60, '0x6b175474e89094c44da98b954eedeac495271d0f');
};
