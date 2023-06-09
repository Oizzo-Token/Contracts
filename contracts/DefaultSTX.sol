// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";

contract DefaultSTX is
    OwnableUpgradeable,
    ERC20Upgradeable,
    ERC20BurnableUpgradeable
{
    address public poolAddress;
    address public taxCollector;
    address public devTeamAddress;
    address public marketTeamAddress;

    uint public taxStartTime;
    uint public taxPeriodTime = 30;

    function initialize(uint256 amount) public initializer {
        __Ownable_init();
        __ERC20Burnable_init();
        __ERC20_init("STX Token", "STX");

        _mint(msg.sender, amount * 1e18);

        // Set initial tax periods
        taxStartTime = block.timestamp;
    }

    function setPoolAddress(address _address) public onlyOwner {
        poolAddress = _address;
    }

    function setDevTeamAddress(address _address) public onlyOwner {
        devTeamAddress = _address;
    }

    function setMarketTeamAddress(address _address) public onlyOwner {
        marketTeamAddress = _address;
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

        uint tax = 0;
        uint currentTime = block.timestamp;
        uint taxSecondTime = taxStartTime + taxPeriodTime;
        uint taxThirdTime = taxSecondTime + taxPeriodTime;
        uint taxFourTime = taxThirdTime + taxPeriodTime;
        uint taxEndTime = taxFourTime + taxPeriodTime;

        if (
            currentTime >= taxStartTime &&
            currentTime < taxEndTime &&
            (msg.sender == poolAddress || to == poolAddress)
        ) {
            bool isBuy = false;
            bool isSell = false;

            if (msg.sender == poolAddress) {
                isBuy = true;
            } else if (to == poolAddress) {
                isSell = true;
            }

            if (isBuy || isSell) {
                if (currentTime >= taxFourTime) {
                    if (isBuy) tax = (value * 20) / 100;
                    if (isSell) tax = (value * 40) / 100;
                } else if (currentTime >= taxThirdTime) {
                    if (isBuy) tax = (value * 10) / 100;
                    if (isSell) tax = (value * 40) / 100;
                } else if (currentTime >= taxSecondTime) {
                    if (isSell) tax = (value * 40) / 100;
                } else if (currentTime >= taxStartTime) {
                    if (isSell) tax = (value * 20) / 100;
                }
            }
        }

        // Subtract tax from transfer value
        uint transferValue = value - tax - (value * 2) / 100;

        // Call the transfer function from the parent contract
        bool success = super.transfer(to, transferValue);
        super.transfer(devTeamAddress, (value * 1) / 100);
        super.transfer(marketTeamAddress, (value * 1) / 100);

        // Send the tax to the tax collector
        if (tax > 0) {
            super.transfer(taxCollector, tax);
        }

        return success;
    }
}
