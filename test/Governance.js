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

    it("returns lottery contract address", async function () {
        let Lottery = await ethers.getContractFactory("Lottery");
        let lottery = await Lottery.deploy(price_lottery, governance.address);

        expect(lottery.address).to.equal(await governance.lottery());
    });

});
