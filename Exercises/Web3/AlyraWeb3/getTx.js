var  Web3  =  require('web3');
web3  =  new  Web3(new  Web3.providers.HttpProvider('https://ropsten.infura.io/v3/4bd31df6a3d54841958c5c8ee0ff8d9a'));

var  ethTx  = ('0xfa9362c2f2e56c68be886f2500be45e61cc17d74d11f1521d01e0adb3136524a');

web3.eth.getTransaction(ethTx, function(err, result) {

    if (!err  &&  result  !==  null) {
        console.log(result); // Log all the transaction info
        console.log('From Address: '  +  result.from); // Log the from address
        console.log('To Address: '  +  result.to); // Log the to address
        console.log('Ether Transacted: '  + (web3.utils.fromWei(result.value, 'ether'))); // Get the value, convert from Wei to Ether and log it
    }
    else {
        console.log('Error!', err); // Dump errors here
    }
});
