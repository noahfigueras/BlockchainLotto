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
        console.log(governance.address);

        // Send Link to governance address;
        [owner] = await ethers.getSigners();
        const link = ethers.utils.parseUnits("1.0", 18);
        owner.sendTransaction({
            to: governance.address,
            value: link
        });
    })

    it("provides a truely random number from chainlink vrf", async function() {
        let random_number = await randomness.getRandomNumber(1);

        console.log(await randomness.most_recent_random());
        expect(await randomness.most_recent_random().to.not.equal(0))
    })
})
        
