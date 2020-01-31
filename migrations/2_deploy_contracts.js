var Governance = artifacts.require("./Governance.sol");

module.exports = function(deployer) {
  deployer.deploy(Governance, 150, '0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA');
};
