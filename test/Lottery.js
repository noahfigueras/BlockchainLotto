const {expect} = require("chai");

describe("Lottery Contract", function() {

    //Defining global variables for testing.
    const price_lottery = ethers.BigNumber.from(1);
    let owner;
    let Lottery;
    let lottery;
    let Governance;
    let governance;
    let Randomness;
    let randomness;

    before(async function () {

        Lottery = await ethers.getContractFactory("Lottery");
        Governance = await ethers.getContractFactory("Governance");
        Randomness = await ethers.getContractFactory("RandomNumberConsumer");

        //Get accounts
        [owner, player1] = await ethers.getSigners();
        
        //Deploy Contracts
        governance = await Governance.deploy();
        randomness = await Randomness.deploy(governance.address, '0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9');
        lottery = await Lottery.deploy(price_lottery, governance.address);

        //Starting new Lottery with 20 s expiration time
        await lottery.start_new_lottery(20);
        
        // Send Link to governance address;
        const link_address = '0xa36085F69e2889c224210F603D836748e7dC0088';
        const abi = [
            "function transfer(address to, uint256 value) external returns (bool success)",
            "function balanceOf(address owner) external view returns (uint256 balance)"
        ];
        const link = new ethers.Contract(link_address, abi, owner);
        await link.transfer(randomness.address, ethers.utils.parseEther("0.5"), {gasLimit:"5000000"});
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
