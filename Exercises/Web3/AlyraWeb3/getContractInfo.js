var Web3 = require('web3');
web3  =  new  Web3(new  Web3.providers.HttpProvider('https://ropsten.infura.io/v3/4bd31df6a3d54841958c5c8ee0ff8d9a'));

console.log('Calling Contract.....');

//var  abi  =  ABI-JSON-INTERFACE;
var  abi  =  [ { "inputs": [ { "internalType": "uint256", "name": "x", "type": "uint256" } ], "name": "set", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "get", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function", "constant": true } ];
var  addr  =  "0x022f3bc191f235d46c9d150581fa7df07d2a820d";

var  Contract  =  new  web3.eth.Contract(abi, addr);

// FUNCTION must the name of the function you want to call.
Contract.methods.get().call().then(console.log);
