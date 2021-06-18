const {expect} = require("chai");

describe("RandomNumberConsumer Contract", function() {
    
    //Global variables
    let owner;
    let Randomness;
    let randomness;
    let Governance;
    let governance;

    before(async function() {

        Governance = await ethers.getContractFactory("Governance");
        Randomness = await ethers.getContractFactory("RandomNumberConsumer");

        governance = await Governance.deploy();
        randomness = await Randomness.deploy(governance.address);

        [owner] = await ethers.getSigners();

        // Send Link to governance address;
        const address = '0xa36085F69e2889c224210F603D836748e7dC0088';
        const abi = [
            "function transfer(address to, uint256 value) external returns (bool success)",
            "function balanceOf(address owner) external view returns (uint256 balance)"
        ];
        const link = new ethers.Contract(address, abi, owner);
        await link.transfer(randomness.address, ethers.utils.parseEther("0.5"), {gasLimit:"5000000"});
    })

    it("provides a truely random number from chainlink vrf", async function() {
        let random_number = await randomness.getRandomNumber(1);

        let number = await randomness.most_recent_random();
        expect(number.toString()).to.not.equal(0))
    })
})
        
