const {expect} = require("chai");

describe("RandomNumberConsumer Contract", function() {
    
    //Global variables
    const price_lottery = ethers.BigNumber.from(1);
    let owner;
    let Randomness;
    let randomness;
    let Governance;
    let governance;
    let VRFMock;
    let vrfMock;
    let Lottery;
    let lottery;

    before(async function() {

        const link_address = '0xa36085F69e2889c224210F603D836748e7dC0088';

        Lottery    = await ethers.getContractFactory("Lottery");
        Governance = await ethers.getContractFactory("Governance");
        Randomness = await ethers.getContractFactory("RandomNumberConsumer");
        VRFMock    = await ethers.getContractFactory("VRFCoordinatorMock");

        vrfMock    = await VRFMock.deploy(link_address);
        governance = await Governance.deploy();
        lottery    = await Lottery.deploy(price_lottery, governance.address);
        randomness = await Randomness.deploy(governance.address, vrfMock.address);

        [owner, player1, player2, player3] = await ethers.getSigners();

        // Send Link to governance address;
        const abi = [
            "function transfer(address to, uint256 value) external returns (bool success)",
            "function balanceOf(address owner) external view returns (uint256 balance)"
        ];
        const link = new ethers.Contract(link_address, abi, owner);
        await link.transfer(randomness.address, ethers.utils.parseEther("0.5"), {gasLimit:"5000000"});

        
    })

    it("provides a truely random number from chainlink vrf", async function() {
        await lottery.start_new_lottery(0);
        await lottery.connect(player1).enter({value: price_lottery});
        await lottery.connect(player2).enter({value: price_lottery});
        await lottery.connect(player3).enter({value: price_lottery});
        await lottery.fulfill_alarm();

        let expected = 777;
        let transaction = await randomness.getRandomNumber(1);
        let tx_receipt = await transaction.wait();

        let request_id = tx_receipt.events[3].data;

        // Test the result of the random number request
        await vrfMock.callBackWithRandomness(request_id, expected, randomness.address);
        expect(await randomness.randomResult()).to.equal(expected);
    })
})
        
