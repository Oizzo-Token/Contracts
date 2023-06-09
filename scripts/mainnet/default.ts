import {ethers, network, upgrades} from "hardhat";

import * as fs from "fs";

async function main() {
    var dir = "./deployed/mainnet";

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    // Obtain reference to contract and ABI.
    const DefaultSTXContract = await ethers.getContractFactory("DefaultSTX");
    console.log("DefaultSTX Contract is deploying to ", network.name);

    //  Deploy logic contract using the proxy pattern.
    const DefaultSTXContract_ = await upgrades.deployProxy(
        DefaultSTXContract,

        //Since the logic contract has an initialize() function
        // we need to pass in the arguments to the initialize()
        // function here.
        [100000000],

        // We don't need to expressly specify this
        // as the Hardhat runtime will default to the name 'initialize'
        {initializer: "initialize"}
    );
    await DefaultSTXContract_.deployed();
    await fs.writeFileSync(`${dir}/stx-proxy.txt`, DefaultSTXContract_.address);

    console.log(
        "DefaultSTX Contract deployed to:",
        DefaultSTXContract_.address
    );
}

main();
