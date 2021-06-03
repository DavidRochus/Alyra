// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dai is ERC20 {
    constructor() public ERC20("Dai Stablecoin", "DAI") {}

    // fonction faucet pour créer des Dai tokens
    function faucet(address recipient, uint256 amount) external {
        _mint(recipient, amount);
    }
}
