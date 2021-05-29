pragma solidity ^0.6.0;

interface GovernanceInterface {
    function init(address lottery, address randomness) external;
    function randomness() external returns(address);
    function lottery() external returns(address);
}
