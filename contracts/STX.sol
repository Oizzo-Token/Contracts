// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";

contract STX is OwnableUpgradeable, ERC20Upgradeable, ERC20BurnableUpgradeable {
    address public poolAddress;

    function initialize(uint256 amount) public initializer {
        __Ownable_init();
        __ERC20Burnable_init();
        __ERC20_init("STX Token", "STX");

        _mint(msg.sender, amount * 1e18);
    }

    function setPoolAddress(address _address) public onlyOwner {
        poolAddress = _address;
    }

    function transfer(
        address to,
        uint256 value
    ) public override returns (bool) {
        // Add your custom logic here
        require(
            msg.sender != to,
            "Transfer error: sender and receiver cannot be the same."
        );
        require(value > 0, "Transfer error: value must be greater than zero.");

        // Call the transfer function from the parent contract
        bool success = super.transfer(to, value);

        return success;
    }
}
