// 2_deploy_contracts.js
const Dai = artifacts.require("Dai");
const MyDeFiProject = artifacts.require("MyDeFiProject");

const tokenAddress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"; //DAI

module.exports = async function (deployer, _network, accounts) {
  const dai = await Dai.at(tokenAddress);
  await deployer.deploy(MyDeFiProject, tokenAddress);

  const myDeFiProject = await MyDeFiProject.deployed();
  await dai.transfer(myDeFiProject.address, 100, {
    from: accounts[0],
  });

  const contractBeforeBalance = await dai.balanceOf(myDeFiProject.address);
  const accountBeforeBalance = await dai.balanceOf(accounts[0]);
  console.log("contractBeforeBalance: " + contractBeforeBalance.toString());
  console.log("accountBeforeBalance: " + accountBeforeBalance.toString());

  await myDeFiProject.foo(accounts[0], 100);

  const contractAfterBalance = await dai.balanceOf(myDeFiProject.address);
  const accountAfterBalance = await dai.balanceOf(accounts[0]);
  console.log("contractAfterBalance: " + contractAfterBalance.toString());
  console.log("accountAfterBalance: " + accountAfterBalance.toString());
};
