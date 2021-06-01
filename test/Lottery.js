const {expect} = require("chai");

describe("Lottery Contract", function() {

    //Defining global variables for testing.
    const price_lottery = ethers.BigNumber.from(1);
    let owner;
    let Lottery;
    let lottery;

    beforeEach(async function () {
        Lottery = await ethers.getContractFactory("Lottery");
        [owner] = await ethers.getSigners();

        lottery = await Lottery.deploy(
            price_lottery,
        );
    });

    it("is supposed to start a new lottery", async function() {
        let foo = 'Noah';
        expect(foo).to.be.a('string');
    })
})
