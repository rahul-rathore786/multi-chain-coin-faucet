// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title TokenFaucet
 * @dev Contract that distributes tokens to users who request them
 */
contract TokenFaucet is Ownable, ReentrancyGuard {
    // Token to be distributed
    IERC20 public token;
    
    // Amount of tokens to distribute per request
    uint256 public amountPerRequest;
    
    // Keep track of addresses that have already claimed tokens
    mapping(address => bool) public hasClaimed;
    
    // Events
    event TokensDistributed(address indexed recipient, uint256 amount);
    event AmountPerRequestChanged(uint256 oldAmount, uint256 newAmount);

    /**
     * @dev Constructor that sets the token and amount per request
     * @param _token Address of the ERC20 token to distribute
     * @param _amountPerRequest Amount of tokens to give per request
     */
    constructor(
        address _token,
        uint256 _amountPerRequest
    ) Ownable() {
        require(_token != address(0), "TokenFaucet: token cannot be the zero address");
        require(_amountPerRequest > 0, "TokenFaucet: amount per request must be greater than zero");
        
        token = IERC20(_token);
        amountPerRequest = _amountPerRequest;
    }

    /**
     * @dev Send tokens to the specified user
     * @param user The address of the user to receive tokens
     */
    function sendTo(address user) external nonReentrant {
        require(user != address(0), "TokenFaucet: recipient cannot be the zero address");
        require(!hasClaimed[user], "TokenFaucet: address has already claimed tokens");
        
        // Mark as claimed
        hasClaimed[user] = true;
        
        // Transfer tokens to the user
        bool success = token.transfer(user, amountPerRequest);
        require(success, "TokenFaucet: token transfer failed");
        
        emit TokensDistributed(user, amountPerRequest);
    }

    /**
     * @dev Change the amount of tokens given per request
     * @param _newAmount New amount per request
     */
    function setAmountPerRequest(uint256 _newAmount) external onlyOwner {
        require(_newAmount > 0, "TokenFaucet: amount per request must be greater than zero");
        uint256 oldAmount = amountPerRequest;
        amountPerRequest = _newAmount;
        emit AmountPerRequestChanged(oldAmount, _newAmount);
    }

    /**
     * @dev Reset claim status for an address (useful for testing)
     * @param user Address to reset claim status for
     */
    function resetClaimStatus(address user) external onlyOwner {
        require(user != address(0), "TokenFaucet: user cannot be the zero address");
        hasClaimed[user] = false;
    }

    /**
     * @dev Withdraw tokens from the contract in case of emergency
     * @param amount Amount of tokens to withdraw
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "TokenFaucet: amount must be greater than zero");
        require(amount <= token.balanceOf(address(this)), "TokenFaucet: insufficient token balance");
        
        bool success = token.transfer(owner(), amount);
        require(success, "TokenFaucet: token transfer failed");
    }
}
