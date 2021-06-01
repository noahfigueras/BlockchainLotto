pragma solidity ^0.6.0;
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "./interfaces/RandomnessInterface.sol";
import "./interfaces/GovernanceInterface.sol";

contract Lottery is ChainlinkClient {
    enum LOTTERY_STATE { OPEN, CLOSED, CALCULATING_WINNER }
    LOTTERY_STATE public lottery_state;
    address payable[] public players;
    address oracle;
    uint256 public lotteryId;
    uint256 public price;
    uint256 private oraclePayment;
    bytes32 private jobId;
    GovernanceInterface private governance;

    constructor(uint256 _price) public {
        setPublicChainlinkToken();
        oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
        oraclePayment = 0.1 * 10 ** 18;
        jobId = '982105d690504c5d9ce374d040c08654';
        price = _price;
        lotteryId = 1;
        lottery_state = LOTTERY_STATE.CLOSED;
        //governance = GovernanceInterface();
        //governance.init(address(this), _governance);
    }

    //Starting Oracle Alarm
    function start_new_lottery(uint256 duration) public {
        require(lottery_state == LOTTERY_STATE.CLOSED, "can't start a new lottery yet");
        lottery_state = LOTTERY_STATE.OPEN;
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill_alarm.selector);
        req.addUint("until", now + duration);
        sendChainlinkRequestTo(oracle, req, oraclePayment);
    }

    //Callback Function after Oracle Alarm is Fulfilled
    function fulfill_alarm(bytes32 _requestId) public recordChainlinkFulfillment(_requestId) {
        require(lottery_state == LOTTERY_STATE.OPEN, "The lottery hasn't even started!");
        lotteryId = lotteryId + 1;
        pickWinner();
    }

    //User joins lottery
    function enter() public payable {
        assert(msg.value == price);
        assert(lottery_state == LOTTERY_STATE.OPEN);
        players.push(msg.sender);
    }

    //Picking Winner
    function pickWinner() private {
        require(lottery_state == LOTTERY_STATE.CALCULATING_WINNER, "You aren't at that stage yet");
        RandomnessInterface(governance.randomness()).getRandom(lotteryId, lotteryId);
    }
    
    //Get Winner through generated random number
    function fulfill_random(uint256 randomness) external {
        require(lottery_state == LOTTERY_STATE.CALCULATING_WINNER, "You aren't at that stage yet!");
        require(randomness > 0, "random-not-found");
        uint256 index = randomness % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
        lottery_state = LOTTERY_STATE.CLOSED;
    }


} 
