import {ethers, upgrades} from "hardhat";
import * as fs from "fs";

async function main() {
    const deployedProxyAddress = fs.readFileSync(
        "./deployed/testnet/oizzo-proxy.txt",
        {
            encoding: "utf8",
        }
    );
    console.log("OIZZO Contract Proxy Address: " + deployedProxyAddress);

    const UpgradedOIZZOV2 = await ethers.getContractFactory("OIZZO");

    console.log("Upgrading OIZZO Contract to V2...");

    await upgrades.upgradeProxy(deployedProxyAddress, UpgradedOIZZOV2);
    console.log("OIZZO Proxy upgraded");
}

main();
