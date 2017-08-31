/* eslint-disable max-len */
// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      host: 'localhost', // Connect to geth on the specified
      port: 8545,
      from: '0x6b6aF9cA81A61Ab2CA7c3FF2A9E1D3d597952999', // default address to use for any transaction Truffle makes during migrations
      gas: 4612388,
      network_id: 4 // Gas limit used for deploys
    }
  }
}
