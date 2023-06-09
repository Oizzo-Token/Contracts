import {ethers, network, upgrades} from "hardhat";

import * as fs from "fs";

async function main() {
    var dir = "./deployed/testnet";

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    // Obtain reference to contract and ABI.
    const DefaultOIZZOContract = await ethers.getContractFactory(
        "DefaultOIZZO"
    );
    console.log("DefaultOIZZO Contract is deploying to ", network.name);

    //  Deploy logic contract using the proxy pattern.
    const DefaultOIZZOContract_ = await upgrades.deployProxy(
        DefaultOIZZOContract,

        //Since the logic contract has an initialize() function
        // we need to pass in the arguments to the initialize()
        // function here.
        [26200000000],

        // We don't need to expressly specify this
        // as the Hardhat runtime will default to the name 'initialize'
        {initializer: "initialize"}
    );
    await DefaultOIZZOContract_.deployed();
    await fs.writeFileSync(
        `${dir}/oizzo-proxy.txt`,
        DefaultOIZZOContract_.address
    );

    console.log(
        "DefaultOIZZO Contract deployed to:",
        DefaultOIZZOContract_.address
    );
}

main();
