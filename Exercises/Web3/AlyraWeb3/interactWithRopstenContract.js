var Web3 = require('web3');
web3 =  new  Web3(new  Web3.providers.HttpProvider('https://ropsten.infura.io/v3/4bd31df6a3d54841958c5c8ee0ff8d9a'));

console.log('Calling Contract.....');

var contractABI = [{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}];
var contractAddress  =  "0x8cD906ff391b25304E0572b92028bE24eC1eABFb";

var contract  =  new  web3.eth.Contract(contractABI, contractAddress);

contract.methods.get().call().then(console.log);
