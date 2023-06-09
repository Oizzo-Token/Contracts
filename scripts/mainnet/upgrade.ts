import {ethers, upgrades} from "hardhat";
import * as fs from "fs";

async function main() {
    const deployedProxyAddress = fs.readFileSync(
        "./deployed/mainnet/stx-proxy.txt",
        {
            encoding: "utf8",
        }
    );
    console.log("STX Contract Proxy Address: " + deployedProxyAddress);

    const UpgradedSTXV2 = await ethers.getContractFactory("STX");

    console.log("Upgrading STX Contract to V2...");

    await upgrades.upgradeProxy(deployedProxyAddress, UpgradedSTXV2);
    console.log("STX Proxy upgraded");
}

main();
