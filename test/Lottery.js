const {expect} = require("chai");
const { time } = require("@openzeppelin/test-helpers");

describe("Lottery Contract", function() {

    //Defining global variables for testing.
    const price_lottery = ethers.BigNumber.from(1);
    let owner;
    let Lottery;
    let lottery;

    before(async function () {
        Lottery = await ethers.getContractFactory("Lottery");
        [owner] = await ethers.getSigners();
        lottery = await Lottery.deploy(
            price_lottery,
        );

        //Starting new Lottery
        await lottery.start_new_lottery(60);
        
    });

    it("should start a chainlink alarm to init new lottery", async function() {

        let lottery_state = await lottery.lottery_state();

        expect(lottery_state).to.equal(0);

        //Initial value
        let lotteryId = await lottery.lotteryId();
        expect(lotteryId).to.equal(1);
    })

    it("increments lotteryID + 1, when chainlink alarm is fulfilled after duration time", async function() {

        //Wait until alarm is fulfilled
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        await timeout(120000);

        //Expected value
        let lotteryId = await lottery.lotteryId();
        expect(lotteryId).to.equal(2);
    })

    after(async function () {
        
    })
})

