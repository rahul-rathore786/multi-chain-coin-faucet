// Configuration for supported blockchains and their respective tokens
export const SUPPORTED_CHAINS = {
  sepolia: {
    name: "Sepolia (ETH Testnet)",
    chainId: 11155111,
    // Using Infura endpoint with API key to avoid CORS issues
    // You should replace 'YOUR_INFURA_API_KEY' with an actual API key from https://infura.io
    // Free tier is available
    rpcUrl: "https://sepolia.infura.io/v3/e5429ea343fd490295f1cd7c036c30d9", // This is a public key for testing
    faucetAddress: "0x0DDE3Ef02DACAB3ce033095156a28c777622D85b",
    tokenAddress: "0xf7d57A3105030D3A9A525a169DCBE05a92Eeb382",
    tokenSymbol: "mUSDT",
    tokenDecimals: 18,
    explorer: "https://sepolia.etherscan.io",
    tokenImage: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
  // More chains can be added here as needed
  // polygon_mumbai: {
  //   name: "Mumbai (Polygon Testnet)",
  //   chainId: 80001,
  //   rpcUrl: "https://rpc-mumbai.maticvigil.com",
  //   faucetAddress: "0xYourMumbaiFaucetAddress", // Replace with actual faucet contract address
  //   tokenAddress: "0xYourMumbaiTokenAddress", // Replace with actual token address
  //   tokenSymbol: "TESTTKN",
  //   tokenDecimals: 18,
  //   explorer: "https://mumbai.polygonscan.com",
  //   tokenImage: "",
  // },
  bnb_testnet: {
    name: "BSC Testnet",
    chainId: 97,
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    faucetAddress: "0xYourBSCFaucetAddress", // Replace with actual faucet contract address
    tokenAddress: "0xYourBSCTokenAddress", // Replace with actual token address
    tokenSymbol: "BSCTKN",
    tokenDecimals: 18,
    explorer: "https://testnet.bscscan.com",
    tokenImage: "",
  },
  // arbitrum_goerli: {
  //   name: "Arbitrum Goerli",
  //   chainId: 421613,
  //   rpcUrl: "https://goerli-rollup.arbitrum.io/rpc",
  //   faucetAddress: "0xYourArbitrumFaucetAddress", // Replace with actual faucet contract address
  //   tokenAddress: "0xYourArbitrumTokenAddress", // Replace with actual token address
  //   tokenSymbol: "ARBTKN",
  //   tokenDecimals: 18,
  //   explorer: "https://goerli.arbiscan.io",
  //   tokenImage: "",
  // },
  hyperion: {
    name: "Hyperion",
    chainId: 133717,
    rpcUrl: "https://hyperion-testnet.metisdevops.link",
    faucetAddress: "0xe6219F53844B8aD16720663bE1d8724D329f45F3", // Replace with actual faucet contract address
    tokenAddress: "0x5c7FbBF922643eaea24F4Cf7FD2F220e70659Ce7", // Replace with actual token address
    tokenSymbol: "mUSDT",
    tokenDecimals: 18,
    explorer: "https://hyperion-testnet.metisdevops.link",
    tokenImage:
      "https://assets.coingecko.com/coins/images/35001/standard/logo.png?1706959346",
  },
};
