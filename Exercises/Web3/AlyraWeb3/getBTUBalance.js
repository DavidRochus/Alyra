const Web3 = require('web3');
const rpcURL = "https://mainnet.infura.io/v3/4bd31df6a3d54841958c5c8ee0ff8d9a";
const web3 = new Web3(rpcURL);
// Account info
const accountAddress = "0xd804ab1667e940052614a5acd103dde4d298ce36";
// Token info (BTU)
const contractAddress = "0xb683d83a532e2cb7dfa5275eed3698436371cc9f";
const contractABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"}];

const simpleStorage = new web3.eth.Contract(contractABI, contractAddress);
simpleStorage.methods.balanceOf(accountAddress).call((err, data) => {
    console.log(data);
});

