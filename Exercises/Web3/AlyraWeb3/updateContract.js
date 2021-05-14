var Tx     = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/4bd31df6a3d54841958c5c8ee0ff8d9a')
const ABI = [ { "inputs": [ { "internalType": "uint256", "name": "x", "type": "uint256" } ], "name": "set", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "get", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function", "constant": true } ];
//const SSaddress = "0xCbd43b4CF42101693689a1f9C201471d8f505E8f";
const SSaddress = "0x022f3bc191f235d46c9d150581fa7df07d2a820d";
const account1 = '0xb8c74A1d2289ec8B13ae421a0660Fd96915022b1' // Your account address 1
const privateKey1 = Buffer.from('B7913D46B2237D76516E79B1ECEF1774DB92E700C5D5EC7CC2D26B205B8DCF19', 'hex')

// Deploy the contract
web3.eth.getTransactionCount(account1, (err, txCount) => {
    const simpleStorage = new web3.eth.Contract(ABI, SSaddress);
    const data = simpleStorage.methods.set(3).encodeABI();
    const txObject = {
        nonce:    web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(1000000), // Raise the gas limit to a much higher amount
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        to: SSaddress,
        data: data
    }

    var tx = new Tx(txObject, {'chain':'ropsten'});
    tx.sign(privateKey1)

    const serializedTx = tx.serialize()
    const raw = '0x' + serializedTx.toString('hex')

    web3.eth.sendSignedTransaction(raw, (err, txHash) => {
        console.log('err:', err, 'txHash:', txHash)
        // Use this txHash to find the contract on Etherscan!
    })
})
