const {expect} = require("chai");

describe("Lottery Contract", function() {

    //Defining global variables for testing.
    const price_lottery = ethers.BigNumber.from(1);
    let owner;
    let Lottery;
    let lottery;
    let Governance;
    let governance;

    before(async function () {
        Lottery = await ethers.getContractFactory("Lottery");
        Governance = await ethers.getContractFactory("Governance");

        //Get accounts
        [owner, player1] = await ethers.getSigners();
        
        //Deploy Contracts
        governance = await Governance.deploy();
        lottery = await Lottery.deploy(price_lottery, governance.address);

        //Starting new Lottery with 20 s expiration time
        await lottery.start_new_lottery(20);
        
    });

    it("should init new lottery", async function() {
        
        //Lottery state is OPEN
        let lottery_state = await lottery.lottery_state();
        expect(lottery_state).to.equal(0);

        //Initial value
        let lotteryId = await lottery.lotteryId();
        expect(lotteryId).to.equal(1);
    })

    it("allows user to join lottery", async function() {
        //Player1 joins the lottery
        await lottery.connect(player1).enter({value: price_lottery});
        let player = await lottery.players(0)
        expect(player1.address).to.equal(player);
    })

    it("reverts fullfill_alarm, before duration time", async function() {
        
        let state = false;
        try {
            //Alarm Callback Fullfilled
            await lottery.fulfill_alarm();
        } catch (err){
            state = true; 
        }
        expect(state).to.equal(true);
    })

    it("fulfils_alarm, after duration time", async function() {
        //Wait until alarm is fulfilled
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
                                            
        await timeout(20000);

        await lottery.fulfill_alarm();
        expect(await lottery.lotteryId()).to.equal(2); 
    })

    after(async function () {
        
    })
})
