/**
 * Created by christianraemy on 29.08.17.
 */

var Web3 = require('web3');
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));

var contractByteCode = '6060604052341561000f57600080fd5b5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b610667806100616000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680625c33e1146100695780633bc5de301461007357806387e4396c146101025780638da5cb5b1461015f57806391b7f5ed146101b4575b600080fd5b6100716101d7565b005b341561007e57600080fd5b610086610283565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100c75780820151818401525b6020810190506100ab565b50505050905090810190601f1680156100f45780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561010d57600080fd5b61015d600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061047f565b005b341561016a57600080fd5b6101726104f6565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156101bf57600080fd5b6101d5600480803590602001909190505061051b565b005b7ffd5a754d10e20703c34db7638040a1c4a4d750cccbb08fb3d7ec3b6fb5dcdfde60405180806020018281038252600e8152602001807f52656365697665642046756e647300000000000000000000000000000000000081525060200191505060405180910390a133600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b565b61028b610582565b6003543073ffffffffffffffffffffffffffffffffffffffff16311015801561030157503373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b15610412576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1662030d403073ffffffffffffffffffffffffffffffffffffffff1631604051600060405180830381858888f193505050505060028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104065780601f106103db57610100808354040283529160200191610406565b820191906000526020600020905b8154815290600101906020018083116103e957829003601f168201915b5050505050905061047c565b7fa3317df609c310deee046c1c4b5da02a6eb4e64bc94026086619ea4b4d3666b06040518080602001828103825260168152602001807f5061796d656e74206e6f742073756666696369656e740000000000000000000081525060200191505060405180910390a15b5b90565b3373ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156104da57600080fd5b80600290805190602001906104f0929190610596565b505b5b50565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b3373ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561057657600080fd5b806003819055505b5b50565b602060405190810160405280600081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106105d757805160ff1916838001178555610605565b82800160010185558215610605579182015b828111156106045782518255916020019190600101906105e9565b5b5090506106129190610616565b5090565b61063891905b8082111561063457600081600090555060010161061c565b5090565b905600a165627a7a72305820e6d2429ee12931eb9fff5963758c73802a04fd00deb71b3597786e4111aa04bd0029';

var contractABI = [{
    "constant": false,
    "inputs": [],
    "name": "receiveFunds",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getData",
    "outputs": [{"name": "dataLocation", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "id", "type": "string"}],
    "name": "setId",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "defaultPrice", "type": "uint256"}],
    "name": "setPrice",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "error", "type": "string"}],
    "name": "NotSufficientPayment",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "message", "type": "string"}],
    "name": "ReceivedFunds",
    "type": "event"
}];

var contractAddress = '0x28152eb4b075e5e412837843e8b323d31a329fd4';
var userAccount = web3.eth.accounts[3];
var amount = web3.toWei(10, "ether");

var contract = web3.eth.contract(contractABI).at(contractAddress);

var hash = contract.receiveFunds.sendTransaction({
        from: userAccount, to: contractAddress,
        value: amount,
        gas: '300000'
    }, function (err, res) {
        if (err)
            console.log("Error: " + err);
        else {
            console.log('Transaction Hash: ' + res);
            var value = contract.getData.call({
                from: userAccount, to: contractAddress
            });
            console.log("Value:" + value);

            contract.getData.sendTransaction({
                from: userAccount, to: contractAddress,
                gas: '300000'
            }, function (err, res) {
                if (err)
                    console.log("Error: " + err);
                else {
                    console.log('Transaction Hash: ' + res);


                }
            });

        }
    }
);

web3.eth.contract(contractABI).at(contractAddress).NotSufficientPayment({}, {
        fromBlock: 'latest',
        toBlock: 'latest'
    },
    function (error, result) {
        if (error) {
            console.log("Error: " + error);
        } else {
            try {
                var errorMessage = result.args.error;
                console.log("Error message: " + errorMessage + ".")


            } catch (e) {
                console.log(e);
            }
        }
    });

web3.eth.contract(contractABI).at(contractAddress).ReceivedFunds({}, {
        fromBlock: 'latest',
        toBlock: 'latest'
    },
    function (error, result) {
        if (error) {
            console.log("Error: " + error);
        } else {
            try {
                var message = result.args.message;
                console.log("Received message: " + message + ".")

            } catch (e) {
                console.log(e);
            }
        }
    });




