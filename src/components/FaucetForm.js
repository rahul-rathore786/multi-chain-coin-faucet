import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { SUPPORTED_CHAINS } from "../utils/chains";
import { recordClaim, hasAddressClaimed } from "../utils/claimStorage";
import TokenFaucet from "../abis/TokenFaucet.json";
import "./FaucetForm.css";
// require("dotenv").config();

const FaucetForm = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedChain, setSelectedChain] = useState("sepolia");
  const [isLoading, setIsLoading] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [hasClaimed, setHasClaimed] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [txResult, setTxResult] = useState({
    status: "",
    message: "",
    txHash: "",
    tokenInfo: null,
  });

  const validateAddress = (address) => {
    try {
      return ethers.utils.isAddress(address);
    } catch (error) {
      return false;
    }
  };

  // Function to connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to use this app.");
      return;
    }

    try {
      setIsConnecting(true);

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];

      setWalletAddress(address);
      setIsConnected(true);

      // Check if this address has already claimed on the selected chain
      if (address && validateAddress(address)) {
        const claimed = hasAddressClaimed(address, selectedChain);
        setHasClaimed(claimed);
      }

      // Listen for account changes
      window.ethereum.on("accountsChanged", (newAccounts) => {
        if (newAccounts.length === 0) {
          // User disconnected
          setIsConnected(false);
          setWalletAddress("");
        } else {
          // User switched accounts
          setWalletAddress(newAccounts[0]);

          // Check claim status for new account
          if (validateAddress(newAccounts[0])) {
            const claimed = hasAddressClaimed(newAccounts[0], selectedChain);
            setHasClaimed(claimed);
          }
        }
      });
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Failed to connect to MetaMask: " + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Check for existing connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);

            // Check claim status
            const claimed = hasAddressClaimed(accounts[0], selectedChain);
            setHasClaimed(claimed);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // We'll keep this for backward compatibility, but it won't be shown in the UI
  const handleAddressChange = (e) => {
    const address = e.target.value;
    setWalletAddress(address);

    if (address && !validateAddress(address)) {
      setAddressError("Please enter a valid Ethereum address");
    } else {
      setAddressError("");

      // Check if this address has already claimed on the selected chain
      if (address && validateAddress(address)) {
        const claimed = hasAddressClaimed(address, selectedChain);
        setHasClaimed(claimed);
      }
    }
  };

  // Check claim status when chain changes
  useEffect(() => {
    if (walletAddress && validateAddress(walletAddress)) {
      const claimed = hasAddressClaimed(walletAddress, selectedChain);
      setHasClaimed(claimed);
    }
  }, [selectedChain, walletAddress]);

  const handleChainChange = async (e) => {
    const chain = e.target.value;
    setSelectedChain(chain);

    // Check if the currently connected address has claimed on this chain
    if (walletAddress && validateAddress(walletAddress)) {
      const claimed = hasAddressClaimed(walletAddress, chain);
      setHasClaimed(claimed);
    }

    // If wallet is connected, try to switch to the selected chain
    if (isConnected && window.ethereum) {
      await switchNetwork(chain);
    }
  };

  // Function to switch network in MetaMask
  const switchNetwork = async (chainId) => {
    if (!window.ethereum) return;

    const chainConfig = SUPPORTED_CHAINS[chainId];
    if (!chainConfig) return;

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainConfig.chainId.toString(16)}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chainConfig.chainId.toString(16)}`,
                chainName: chainConfig.name,
                rpcUrls: [chainConfig.publicRpcUrl || chainConfig.rpcUrl],
                nativeCurrency: {
                  name: chainConfig.name.split(" ")[0], // Use first part of chain name
                  symbol: chainConfig.name.split(" ")[0],
                  decimals: 18,
                },
                blockExplorerUrls: [chainConfig.explorer],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding network to MetaMask:", addError);
        }
      }
      // Other errors
      console.error("Error switching network:", switchError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!walletAddress || !validateAddress(walletAddress)) {
      setAddressError("Please enter a valid Ethereum address");
      return;
    }

    // Check if this address has already claimed on this chain
    if (hasAddressClaimed(walletAddress, selectedChain)) {
      setResult({
        status: "error",
        message: `This address has already claimed tokens on ${SUPPORTED_CHAINS[selectedChain].name}. Each address can only claim once per chain.`,
        txHash: "",
        tokenInfo: null,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get the chain configuration
      const chainConfig = SUPPORTED_CHAINS[selectedChain];
      if (!chainConfig) {
        throw new Error("Invalid chain selected");
      }

      console.log(
        "Connecting to network:",
        chainConfig.name,
        "using RPC:",
        chainConfig.rpcUrl
      );

      // Create provider with more robust error handling
      let provider;
      try {
        provider = new ethers.providers.JsonRpcProvider(chainConfig.rpcUrl, {
          name: chainConfig.name,
          chainId: chainConfig.chainId,
        });

        // Test the provider connection
        const network = await provider.getNetwork();
        console.log(
          "Connected to network:",
          network.name,
          "chainId:",
          network.chainId
        );
      } catch (providerError) {
        console.error("Provider connection error:", providerError);
        throw new Error(
          `Failed to connect to ${chainConfig.name} network. Please check your internet connection or try again later.`
        );
      }

      // This is a frontend-only approach using a pre-funded account
      // WARNING: Never expose private keys in production code
      // In a real-world scenario, you would use a backend service for this
      // Access the environment variable
      // Make sure to restart the dev server after changing .env files
      const privateKey = process.env.REACT_APP_ADMIN_PRIVATE_KEY;
      console.log("Private key available:", !!privateKey); // Debug log, remove in production

      if (!privateKey) {
        throw new Error(
          "Admin private key not found. Make sure REACT_APP_ADMIN_PRIVATE_KEY is set in your .env file and restart the dev server."
        );
      }

      // Create wallet with more detailed error handling
      let adminWallet;
      try {
        adminWallet = new ethers.Wallet(privateKey, provider);
        console.log("Wallet created successfully", adminWallet.address);
      } catch (walletError) {
        console.error("Wallet creation error:", walletError);
        throw new Error(
          "Failed to initialize wallet. Please check your private key configuration."
        );
      }

      // Create contract instance
      let faucetContract;
      try {
        faucetContract = new ethers.Contract(
          chainConfig.faucetAddress,
          TokenFaucet.abi,
          adminWallet
        );
        console.log(
          "Contract instance created at address:",
          chainConfig.faucetAddress
        );
      } catch (contractError) {
        console.error("Contract creation error:", contractError);
        throw new Error(
          "Failed to create contract instance. Please check the contract address and ABI."
        );
      }

      // Call the sendTo function
      console.log("Sending tokens to:", walletAddress);
      const tx = await faucetContract.sendTo(walletAddress);

await tx.wait();
console.log("Transaction confirmed");

// Mark address as claimed for this chain
markAddressAsClaimed(walletAddress, selectedChain);
setHasClaimed(true);

// Success
setTxResult({
status: "success",
message: `Successfully sent 1000 ${chainConfig.tokenSymbol} tokens to your address.`,
txHash: tx.hash,
tokenInfo: {
...chainConfig,
},
});
} catch (error) {
console.error("Error sending tokens:", error);

// More user-friendly error message based on error type
let errorMessage = error.message;

if (errorMessage.includes("noNetwork") || errorMessage.includes("CORS")) {
errorMessage =
"Network connection error. This is likely due to CORS restrictions in your browser. We've updated to use Infura, please refresh the page and try again.";
} else if (errorMessage.includes("insufficient funds")) {
errorMessage =
"The faucet contract doesn't have enough funds to complete this transaction. Please contact the administrator.";
}

setTxResult({
status: "error",
message: `Failed to send tokens: ${errorMessage}`,
txHash: null,
tokenInfo: null,
});
} finally {
setIsLoading(false);
}
};
  };

  // Function to add token to MetaMask
  const addTokenToMetaMask = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    const chainConfig = SUPPORTED_CHAINS[selectedChain];
    if (!chainConfig) return;

    try {
      // Request to add the token
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: chainConfig.tokenAddress,
            symbol: chainConfig.tokenSymbol,
            decimals: chainConfig.tokenDecimals,
            image: chainConfig.tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log("Token added to MetaMask successfully!");
      } else {
        console.log("User rejected adding the token.");
      }
    } catch (error) {
      console.error("Error adding token to MetaMask:", error);
    }
  };

  const [contractBalance, setContractBalance] = useState("0");
  const [maxBalance, setMaxBalance] = useState(1000000); // Default max balance

  // Function to fetch contract balance
  const fetchContractBalance = async () => {
    try {
      const chainConfig = SUPPORTED_CHAINS[selectedChain];
      if (!chainConfig) return;

      const provider = new ethers.providers.JsonRpcProvider(
        chainConfig.rpcUrl,
        {
          name: chainConfig.name,
          chainId: chainConfig.chainId,
        }
      );

      // Create ERC20 contract instance
      const tokenContract = new ethers.Contract(
        chainConfig.tokenAddress,
        [
          "function balanceOf(address owner) view returns (uint256)",
          "function decimals() view returns (uint8)",
        ],
        provider
      );

      // Get contract balance
      const balance = await tokenContract.balanceOf(chainConfig.faucetAddress);
      const decimals = await tokenContract.decimals();

      // Format the balance
      const formattedBalance = ethers.utils.formatUnits(balance, decimals);
      setContractBalance(formattedBalance);

      // Set max balance to 1M tokens or twice the current balance, whichever is higher
      setMaxBalance(Math.max(1000000, parseFloat(formattedBalance) * 2));
    } catch (error) {
      console.error("Error fetching contract balance:", error);
    }
  };

  // Fetch balance when chain changes
  useEffect(() => {
    if (isConnected) {
      fetchContractBalance();
    }
  }, [selectedChain, isConnected]);

  // Calculate the percentage for the progress bar
  const balancePercentage = Math.min(
    100,
    (parseFloat(contractBalance) / maxBalance) * 100
  );

  return (
    <div className="faucet-form-container">
      <form className="faucet-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Wallet Connection</label>
          {!isConnected ? (
            <button
              type="button"
              className="btn btn-connect"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="wallet-info">
              <div className="wallet-address">
                <span className="address-label">Connected:</span>
                <span className="address-value">
                  {walletAddress.substring(0, 6)}...
                  {walletAddress.substring(walletAddress.length - 4)}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-disconnect"
                onClick={() => {
                  setIsConnected(false);
                  setWalletAddress("");
                }}
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="blockchain">Select Blockchain</label>
          <select
            id="blockchain"
            value={selectedChain}
            onChange={
              handleChainChange
            } /* Changed to use our network switching function */
            disabled={isLoading}
          >
            {Object.keys(SUPPORTED_CHAINS).map((chain) => (
              <option key={chain} value={chain}>
                {SUPPORTED_CHAINS[chain].name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !isConnected || hasClaimed}
        >
          {isLoading
            ? "Processing..."
            : hasClaimed
            ? "Already Claimed"
            : `Send 1000 ${
                SUPPORTED_CHAINS[selectedChain]?.tokenSymbol || ""
              } Tokens`}
        </button>
        {txResult.status && (
          <div
            className={`result-box ${
              txResult.status === "success" ? "result-success" : "result-error"
            }`}
          >
            <div className="result-icon">
              {txResult.status === "success" ? "✅" : "❌"}
            </div>
            <div className="result-content">
              <h3>
                {txResult.status === "success"
                  ? "Transaction Successful!"
                  : "Transaction Failed"}
              </h3>
              <p>{txResult.message}</p>
              {txResult.txHash && (
                <p className="tx-hash">
                  Transaction Hash:{" "}
                  <a
                    href={`${txResult.tokenInfo?.explorer}/tx/${txResult.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {txResult.txHash.substring(0, 8)}...
                    {txResult.txHash.substring(txResult.txHash.length - 8)}
                    <span className="external-link">↗</span>
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
        {isConnected && (
          <div className="contract-balance-container">
            <h4>Faucet Balance</h4>
            <div className="balance-info">
              <span>
                {parseFloat(contractBalance).toLocaleString()}{" "}
                {SUPPORTED_CHAINS[selectedChain]?.tokenSymbol}
              </span>
            </div>
            {/* <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${balancePercentage}%` }}
              ></div>
            </div>
            <div className="balance-percentage">
              {balancePercentage.toFixed(1)}% of capacity
            </div> */}
          </div>
        )}

        {isConnected && (
          <button
            type="button"
            className="btn btn-add-token"
            onClick={addTokenToMetaMask}
          >
            Add Token to MetaMask
          </button>
        )}
      </form>

      <div className="network-info">
        {selectedChain && (
          <div className="token-info">
            <h3>Selected Token Information</h3>
            <p>
              <strong>Network:</strong> {SUPPORTED_CHAINS[selectedChain].name}
            </p>
            <p>
              <strong>Token Symbol:</strong>{" "}
              {SUPPORTED_CHAINS[selectedChain].tokenSymbol}
            </p>
            <p>
              <strong>Token Address:</strong>{" "}
              {SUPPORTED_CHAINS[selectedChain].tokenAddress}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaucetForm;
