pragma solidity ^0.6.0;

contract Governance {
    uint256 public one_time;
    address public lottery;
    address public randomness;

    constructor() public {
    }

    function init(address _lottery, address _randomness) public {
        require(_randomness != address(0), "governance/no-random-address");
        require(_lottery != address(0), "no-lottery-address-given");
        randomness = _randomness;
        lottery = _lottery;
    }
/*
    function lottery() external returns(address) {
        return lottery;
    }

    function randomness() external returns(address) {
        return randomness;
    }
  */
}


