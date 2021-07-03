async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
        'Deploying contracts with the account:',
        deployer.address
    );

    console.log('Account balance:', (await deployer.getBalance()).toString());

    const vrfCoordinator = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9";

    const Lottery = await ethers.getContractFactory('Lottery');
    const Governance = await ethers.getContractFactory('Governance');
    const RandomNumberConsumer = await ethers.getContractFactory('RandomNumberConsumer');

    const governance = await Governance.deploy();
    const lottery = await Lottery.deploy(ethers.utils.parseEther('0.1'), governance.address);
    const randomNumberConsumer = await RandomNumberConsumer.deploy(governance.address, vrfCoordinator);


    console.log('Lottery address:', lottery.address);
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
