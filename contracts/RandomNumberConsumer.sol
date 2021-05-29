pragma solidity ^0.6.0;
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "./interfaces/GovernanceInterface.sol";
import "./interfaces/LotteryInterface.sol";

contract RandomNumberConsumer is VRFConsumerBase {
    
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    uint256 public most_recent_random;
    address private vrfCoordinator;
    GovernanceInterface private governance;

    /**
        * Constructor inherits VRFConsumerBase
        * 
        * Network: Kovan
        * Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
        * LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
        * Key Hash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4
    */

   constructor(address _governance)
        VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088 // LINK Token
        ) public 
    {
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18; // 0.1 LINK
        governance = GovernanceInterface(_governance);
        vrfCoordinator = 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9;
    } 

    //Request randomness from a user-provided seed
    function getRandomNumber(uint256 userProvidedSeed) public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee, userProvidedSeed);
    }

    //Callback function used by VRF Coordinator
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        require(msg.sender == vrfCoordinator, "Fulfillment only permitted by Coordinator");
        most_recent_random = randomness;
        //uint lotteryId = requestIds[requestId];
        //randomNumber[lotteryId] = randomness;
        LotteryInterface(governance.lottery()).fulfill_random(randomness);
    }
}

