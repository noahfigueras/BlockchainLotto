const {expect} = require("chai");

describe("Governance Contract", function() {
        
    //Global variables
    const price_lottery = ethers.BigNumber.from(1);
    let owner;
    let Governance;
    let governace;

    before(async function () {
        Governance = await ethers.getContractFactory("Governance");
        [owner] = await ethers.getSigners();
        governance = await Governance.deploy();
    });

    it("reverts when lottery contract address is null", async function () {
        let state = false;

        try{
            await governance.lottery()
        } catch(err) {
            state = true;
        }

        expect(state).to.equal(true);
    })

    it("reverts when RandomConsumerNumber contract address is null", async function () {
        let state = false;

        try{
            await governance.randomness();
        } catch(err) {
            state = true;
        }

        expect(state).to.equal(true);
    })

    it("returns lottery contract address", async function () {
        let Lottery = await ethers.getContractFactory("Lottery");
        let lottery = await Lottery.deploy(price_lottery, governance.address);

        expect(lottery.address).to.equal(await governance.lottery());
    });

    it("returns randomNumberConsumer contract address", async function () {
        let Randomness = await ethers.getContractFactory("RandomNumberConsumer");
        let randomness = await Randomness.deploy(governance.address, '0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9');

        expect(randomness.address).to.equal(await governance.randomness());
    });

});
