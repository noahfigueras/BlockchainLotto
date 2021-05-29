pragma solidity ^0.6.0;

interface RandomnessInterface {
    function randomNumber(uint) external view returns (uint);
    function getRandom(uint, uint) external;
}

