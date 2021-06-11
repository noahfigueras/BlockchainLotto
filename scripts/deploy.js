async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
        'Deploying contracts with the account:',
        deployer.address
    );

    console.log('Account balance:', (await deployer.getBalance()).toString());

    const Lottery = await ethers.getContractFactory('Lottery');
    const lottery = await Lottery.deploy(ethers.BigNumber.from(1));

    console.log('Lottery address:', lottery.address);
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
