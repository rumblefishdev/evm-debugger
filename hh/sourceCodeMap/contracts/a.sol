pragma solidity ^0.8.4;

contract A {
    function getBalance() external view returns(uint256) {
        revert("My_MESSAGE");
    }

    function doSomething() public payable returns(uint256) {
        try this.getBalance() returns (uint256 balance) {
            return balance;
        } catch {
            return 43;
        }

        return 0;
    }
}