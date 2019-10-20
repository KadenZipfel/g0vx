const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
const keys = require('./keys');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    ropsten: {
      provider: () => {
        return new HDWalletProvider(keys.privKey, "https://ropsten.infura.io/v3/37c378bac13f456ba63d4126c8237c38");
      },
      network_id: 3
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(keys.privKey, "https://rinkeby.infura.io/v3/37c378bac13f456ba63d4126c8237c38");
      },
      network_id: 4
    },
    mainnet: {
      provider: () => {
        return new HDWalletProvider(keys.privKey, "https://mainnet.infura.io/v3/37c378bac13f456ba63d4126c8237c38");
      },
      network_id: 1
    }
  }
};
