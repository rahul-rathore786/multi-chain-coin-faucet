/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// This is a sample Hardhat configuration file. You need to:
// 1. Create a .env file in the contracts directory
// 2. Add the following variables to the .env file:
//    - PRIVATE_KEY=your_wallet_private_key
//    - SEPOLIA_RPC_URL=your_sepolia_rpc_url
//    - MUMBAI_RPC_URL=your_mumbai_rpc_url
//    - BSC_TESTNET_RPC_URL=your_bsc_testnet_rpc_url
//    - ARBITRUM_GOERLI_RPC_URL=your_arbitrum_goerli_rpc_url
//    - ETHERSCAN_API_KEY=your_etherscan_api_key (optional for verification)

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001,
    },
    bscTestnet: {
      url:
        process.env.BSC_TESTNET_RPC_URL ||
        "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 97,
    },
    arbitrumGoerli: {
      url:
        process.env.ARBITRUM_GOERLI_RPC_URL ||
        "https://goerli-rollup.arbitrum.io/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 421613,
    },
    hyperion: {
      url:
        process.env.HYPERION_RPC_URL ||
        "https://hyperion-testnet.metisdevops.link",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 133717,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  // source files and artifacts
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts-bnb",
  },
};
