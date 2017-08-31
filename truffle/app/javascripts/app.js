/* eslint-disable max-len,no-unused-vars,no-multiple-empty-lines */
// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css'


// Import libraries we need.

/* import { default as Web3} from 'web3';
 import { default as contract } from 'truffle-contract'

 // Import our contract artifacts and turn them into usable abstractions.
 import metacoin_artifacts from '../../build/contracts/MetaCoin.json'

 // MetaCoin is our usable abstraction, which we'll use through the code below.
 var MetaCoin = contract(metacoin_artifacts); */

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts
var account



var Web3 = require('web3')
var http = require('http')
var request = require('request')

var url = 'mongodb://localhost:27017/mydb'

var contractByteCode
var contractABI
var contract
var contractAddress

window.App = {
  start: function () {
    var self = this
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      var web3 = new Web3(web3.currentProvider);
    } else {
      var web3 = new Web3()
      web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'))
    }

    contractByteCode = '6060604052341561000f57600080fd5b5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b6106ac806100616000396000f30060606040523615610075576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680625c33e11461007a5780633bc5de301461008457806387e4396c146101135780638da5cb5b1461017057806391b7f5ed146101c557806398d5fdca146101e8575b600080fd5b610082610211565b005b341561008f57600080fd5b6100976102bd565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100d85780820151818401525b6020810190506100bc565b50505050905090810190601f1680156101055780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561011e57600080fd5b61016e600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506104b9565b005b341561017b57600080fd5b610183610530565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156101d057600080fd5b6101e66004808035906020019091905050610555565b005b34156101f357600080fd5b6101fb6105bc565b6040518082815260200191505060405180910390f35b7ffd5a754d10e20703c34db7638040a1c4a4d750cccbb08fb3d7ec3b6fb5dcdfde60405180806020018281038252600e8152602001807f52656365697665642046756e647300000000000000000000000000000000000081525060200191505060405180910390a133600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b565b6102c56105c7565b6003543073ffffffffffffffffffffffffffffffffffffffff16311015801561033b57503373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b1561044c576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1662030d403073ffffffffffffffffffffffffffffffffffffffff1631604051600060405180830381858888f193505050505060028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104405780601f1061041557610100808354040283529160200191610440565b820191906000526020600020905b81548152906001019060200180831161042357829003601f168201915b505050505090506104b6565b7fa3317df609c310deee046c1c4b5da02a6eb4e64bc94026086619ea4b4d3666b06040518080602001828103825260168152602001807f5061796d656e74206e6f742073756666696369656e740000000000000000000081525060200191505060405180910390a15b5b90565b3373ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561051457600080fd5b806002908051906020019061052a9291906105db565b505b5b50565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b3373ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156105b057600080fd5b806003819055505b5b50565b600060035490505b90565b602060405190810160405280600081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061061c57805160ff191683800117855561064a565b8280016001018555821561064a579182015b8281111561064957825182559160200191906001019061062e565b5b509050610657919061065b565b5090565b61067d91905b80821115610679576000816000905550600101610661565b5090565b905600a165627a7a7230582003d8f5407130279ca4b273a03842143b6a8c1cce0afcbc373a50c2f6bea08e8b0029'
    // var contractAddress = '0x309e12297e65c13edec7ef3860edc24a3b264fd5';
    contractABI = [{
      'constant': false,
      'inputs': [],
      'name': 'receiveFunds',
      'outputs': [],
      'payable': true,
      'stateMutability': 'payable',
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [],
      'name': 'getData',
      'outputs': [{ 'name': 'dataLocation', 'type': 'string' }],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    }, {
      'constant': false,
      'inputs': [{ 'name': 'id', 'type': 'string' }],
      'name': 'setId',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [],
      'name': 'owner',
      'outputs': [{ 'name': '', 'type': 'address' }],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    }, {
      'constant': false,
      'inputs': [{ 'name': 'defaultPrice', 'type': 'uint256' }],
      'name': 'setPrice',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [],
      'name': 'getPrice',
      'outputs': [{ 'name': 'definedPrice', 'type': 'uint256' }],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    }, { 'inputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'constructor' }, {
      'anonymous': false,
      'inputs': [{ 'indexed': false, 'name': 'error', 'type': 'string' }],
      'name': 'NotSufficientPayment',
      'type': 'event'
    }, {
      'anonymous': false,
      'inputs': [{ 'indexed': false, 'name': 'message', 'type': 'string' }],
      'name': 'ReceivedFunds',
      'type': 'event'
    }]

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length == 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.')
        return
      }

      accounts = accs
      account = accounts[0]

    })
  },

  setStatus: function (message) {
    var status = document.getElementById('status')
    status.innerHTML = message
  },

  register: function () {
    var self = this

    var sensorId = document.getElementById('sensorId').value
    var price = web3.toWei(parseInt(document.getElementById('priceValue').value), 'ether')
    var location = document.getElementById('location').value

    this.setStatus('Initiating contract... (please wait)')

    web3.eth.contract(contractABI).new({
      from: web3.eth.coinbase,
      data: contractByteCode,
      gas: 3000000
    }, function (err, contract) {
      if (!err && contract.address) {
        console.log('deployed on:', contract.address)

        contractAddress = contract.address
        contract = web3.eth.contract(contractABI).at(contractAddress)

        var resultId = contract.setId(sensorId,
          { from: web3.eth.coinbase, gas: 3000000 }, function (err, res) {
            if (err) { console.log(err) } else { console.log('transaction hash:' + res) }
          })

        var resultPrice = contract.setPrice(price,
          { from: web3.eth.coinbase, gas: 3000000 }, function (err, res) {
            if (err) { console.log(err) } else {
              console.log('transaction hash:' + res)
              self.setStatus('Contract Deployed completed!')
            }
          })

        document.getElementById('contractAddress').innerHTML = contractAddress
        var url = 'http://localhost:3000/mongoDB/store/'
        var r = request.post(url + location + '/' + contractAddress, 'no-cors')
        console.log(r)
      } else {
        console.log('Error: ' + err)
      }
    })
  },

  buy: function () {
    var self = this

    var location = document.getElementById('location').value
    var url = 'http://localhost:3000/mongoDB/getContractAddress/'
    request.get(url + location, function (error, response, body) {
      console.log('error:', error) // Print the error if one occurred
      console.log('statusCode:', response + ' ' + response.statusCode) // Print the response status code if a response was received
      console.log('body:', body) // Print the HTML for the Google homepage.
    })

    var contract = web3.eth.contract(contractABI).at(contractAddress)

    var amount = contract.getPrice.call({
      from: web3.eth.accounts[1], to: contractAddress
    })

    var hash = contract.receiveFunds.sendTransaction({
      from: web3.eth.accounts[1],
      to: contractAddress,
      value: amount,
      gas: '300000'
    }, function (err, res) {
      if (err) { console.log('Error: ' + err) } else {
        console.log('Transaction Hash: ' + res)
        var value = contract.getData.call({
          from: web3.eth.accounts[1], to: contractAddress
        })
        console.log('Value:' + value)

        contract.getData.sendTransaction({
          to: contractAddress,
          from: web3.eth.accounts[1],
          gas: '300000'
        }, function (err, res) {
          if (err) { console.log('Error: ' + err) } else {
            console.log('Transaction Hash: ' + res)
          }
        })

        document.getElementById('sensorResult').innerHTML = value
      }
    }
    )
  }
}

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn('Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask')
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn('No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }

  App.start()
})
