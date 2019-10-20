# G0VX

G0VX is a Decentralized Governance Proposal. Create and vote on organization proposals.

## Example

https://kadenzipfel.github.io/g0vx/

Try it yourself (Rinkeby):
- Download metamask
- Switch to Rinkeby test network
- Get some test ether from a faucet
- Create a proposals
- Delegate your voting power
- Vote for proposals
- View proposal results

## Features

- Provably fair, trustless, decentralized
- Create, vote, and delegate proposals
- Transaction lifecycle notifications, i.e. 'Transaction Pending...', 'Transaction Confirmed'
- Solidity 0.5.0
- Security audit (pending)
- React front-end
- Seamless contract interaction
- Flawless mobile optimization
- Complete test suite (pending)

## Getting Started

Want to make use of G0VX in your organization? Simply follow these steps. 
[Difficulty: Intermediate]

**Note**: 💀 This project has yet to be audited. Use at your own risk. 💀 

- `git clone` this repository
- In the root directory, create a new file called `keys.js` with your private key as below
```
module.exports = {
  privKey: 'PRIVATE_KEY'
}
```
**Note**: Be sure to gitignore `keys.js`
- Setup truffle-config with your own [infura](https://infura.io/) API's
```
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
        return new HDWalletProvider(keys.privKey, "ROPSTEN_API_HERE");
      },
      network_id: 3
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(keys.privKey, "RINKEBY_API_HERE");
      },
      network_id: 4
    },
    mainnet: {
      provider: () => {
        return new HDWalletProvider(keys.privKey, "MAINNET_API_HERE");
      },
      network_id: 1
    }
  }
};
```
- In `migrations/2_deploy_contracts.js`, set the contract time limit (The length of time users can vote on a proposal in seconds)
```
var Governance = artifacts.require("./Governance.sol");

module.exports = function(deployer) {
  deployer.deploy(Governance, TIME_LIMIT_HERE_IN_SECONDS);
};
```
- From the root directory, run `npm install`
- From `/client`, again run `npm install`
- To deploy contract, from the root directory, run `truffle migrate --reset --network YOUR_NETWORK_HERE`
- To run local server, from `/client`, run `npm run start`
- And we're live!

## License

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.