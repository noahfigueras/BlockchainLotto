const {expect} = require("chai");

describe("Lottery Contract", function() {

    //Defining global variables for testing.
    const price_lottery = ethers.utils.parseEther("10.0");
    let owner;
    let Lottery;
    let lottery;
    let Governance;
    let governance;
    let Randomness;
    let randomness;
    let VRFMock;
    let vrfMock;

    before(async function () {

        const link_address = '0xa36085F69e2889c224210F603D836748e7dC0088';

        Lottery = await ethers.getContractFactory("Lottery");
        Governance = await ethers.getContractFactory("Governance");
        Randomness = await ethers.getContractFactory("RandomNumberConsumer");
        VRFMock    = await ethers.getContractFactory("VRFCoordinatorMock");

        //Get accounts
        [owner, player1, player2, player3] = await ethers.getSigners();
        
        //Deploy Contracts
        governance = await Governance.deploy();
        vrfMock    = await VRFMock.deploy(link_address);
        randomness = await Randomness.deploy(governance.address, vrfMock.address);
        lottery = await Lottery.deploy(price_lottery, governance.address);

        //Starting new Lottery with 5 s expiration time
        await lottery.start_new_lottery(10);
        
        // Send Link to governance address;
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
        await lottery.connect(player2).enter({value: price_lottery});
        await lottery.connect(player3).enter({value: price_lottery});

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
                                            
        await timeout(10000);

        await lottery.fulfill_alarm();
        expect(await lottery.lotteryId()).to.equal(2); 
    })

    it("makes sure random winner gets money transfered", async function() {

        //Call Oracle Simulation
        let expected = 7;
        let transaction = await randomness.getRandomNumber(await lottery.lotteryId());
        let tx_receipt = await transaction.wait();

        let request_id = tx_receipt.events[3].data;

        // Test the result of the random number request
        let oracle_call = await vrfMock.callBackWithRandomness(request_id, expected, randomness.address);
        let oracle_receipt = await oracle_call.wait();

        let winner_addr = "0x" + oracle_receipt.events[0].data.slice(26);
        expect(winner_addr).to.equal(player2.address.toLowerCase());
        
        //Compare players Balances (player2 should win)
        let bool = false;
        let player1_balance = Number(ethers.utils.formatEther(await player1.getBalance()));
        let player2_balance = Number(ethers.utils.formatEther(await player2.getBalance()));
        let player3_balance = Number(ethers.utils.formatEther(await player3.getBalance()));

        if((player2_balance <= player1_balance) || (player2_balance <= player3_balance)){
            bool = true;
        } 
        expect(bool).to.equal(false);

    })

        
})
