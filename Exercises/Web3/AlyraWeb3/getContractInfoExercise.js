var Web3 = require('web3');
web3  =  new  Web3(new  Web3.providers.HttpProvider('https://mainnet.infura.io/v3/4bd31df6a3d54841958c5c8ee0ff8d9a'));

console.log('Calling Contract.....');

var  contractABI  =  [{"constant":true,"inputs":[],"name":"getEbola","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tipCreator","outputs":[{"name":"","type":"string"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];
var  contractAddress  =  "0xe16f391e860420e65c659111c9e1601c0f8e2818";

var  contract  =  new  web3.eth.Contract(contractABI, contractAddress);

contract.methods.getInfo().call().then(console.log);
contract.methods.getEbola().call().then(console.log);
contract.methods.tipCreator().call().then(console.log);
