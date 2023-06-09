import hre from "hardhat";

describe("Basic NFT", function () {
    let basicNFTContract: any;

    before(async function () {
        const [owner] = await hre.ethers.getSigners();
        const BasicNFT = await hre.ethers.getContractFactory("BasicNFT");
        basicNFTContract = await BasicNFT.deploy();

        await basicNFTContract.deployed();

        await basicNFTContract
            .connect(owner)
            .initialize(
                "https://ipfs.io/ipfs/QmVv7iABg6DSzo8BHBgGqptGX49TAn1q5eEigPUj3bCBD5/",
                "0xd9faD5E6997e72d726bdCe6C441f3Edf9d908776",
                "0x11C59838463Dbfd4302854F4F02498d979Ef0af3",
                "0x5D5dC95d2B3a456F716D24802219A0a94BFd16Bb",
                "0x7B9d03212D8f2B43d14251603F6DfA5E4a290D54",
                "0xE592427A0AEce92De3Edee1F18E0157C05861564",
                "20"
            );
    });

    describe("Deployment", function () {
        it("Should deploy BasicNFT", async function () {
            console.log("BasicNFT deployed to: ", basicNFTContract.address);
        });

        it("Stake and unStatke", async function () {
            const [owner] = await hre.ethers.getSigners();

            await basicNFTContract.connect(owner).mint();
            await basicNFTContract.connect(owner).mint();
            await basicNFTContract.connect(owner).mint();
            await basicNFTContract.connect(owner).mint();
            await basicNFTContract.connect(owner).mint();
            await basicNFTContract.connect(owner).mint();
            await basicNFTContract.connect(owner).mint();
            await basicNFTContract.connect(owner).mint();
            await basicNFTContract.connect(owner).mint();
            await basicNFTContract.connect(owner).mint();

            basicNFTContract
                .connect(owner)
                .setApprovalForAll(basicNFTContract.address, true);
            await basicNFTContract.connect(owner).stake(1);
            await basicNFTContract.connect(owner).stake(3);
            await basicNFTContract.connect(owner).stake(2);
            await basicNFTContract.connect(owner).unstake(2);
            await basicNFTContract.connect(owner).stake(4);
            await basicNFTContract.connect(owner).setUsedFlag(3);
            await basicNFTContract.connect(owner).setUsedFlag(6);

            const tokenIdsOfOwner = await basicNFTContract.tokenIdsOfOwner(
                owner.address
            );
            const stakedTokenIdsOfOwner =
                await basicNFTContract.stakedTokenIdsOfOwner(owner.address);
            const tokenIdsOfNotUsed = await basicNFTContract.tokenIdsOfNotUsed(
                owner.address
            );
            console.log("tokenIdsOfOwner: ", tokenIdsOfOwner);
            console.log("stakedTokenIdsOfOwner: ", stakedTokenIdsOfOwner);
            console.log("tokenIdsOfNotUsed: ", tokenIdsOfNotUsed);

            // const address = await basicNFTContract.ownerOf(1);
            // console.log("Owner Address: ", address);

            // await basicNFTContract.connect(owner).unstake(1);

            // const balanceOfkakiContract = await basicNFTContract.balanceOf(
            //     basicNFTContract.address
            // );
            // console.log(
            //     "Basic NFT balanceOf basicNFTContract: ",
            //     balanceOfkakiContract
            // );
        });
    });
});
