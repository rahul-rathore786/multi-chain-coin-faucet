const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Mock USDT Token
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy(
    "Mock USDT", // Name
    "mUSDT", // Symbol
    18, // Decimals
    1000000000000 // Initial supply (1 billion tokens)
  );

  await mockUSDT.deployed();
  console.log("MockUSDT deployed to:", mockUSDT.address);

  // Calculate token amount for faucet distribution (1000 tokens per request)
  const tokenAmount = ethers.utils.parseUnits("1000", 18);

  // Deploy Faucet contract
  const TokenFaucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = await TokenFaucet.deploy(
    mockUSDT.address, // Token address
    tokenAmount // Amount per request
  );

  await faucet.deployed();
  console.log("TokenFaucet deployed to:", faucet.address);

  // Transfer tokens to the faucet (1000000000)
  const faucetAmount = ethers.utils.parseUnits("1000000000", 18);
  await mockUSDT.transfer(faucet.address, faucetAmount);
  console.log(
    `Transferred ${ethers.utils.formatUnits(
      faucetAmount,
      18
    )} tokens to the faucet`
  );

  console.log(
    "\nDeployment complete! Update the following in your chains.js file:"
  );
  console.log(`faucetAddress: "${faucet.address}"`);
  console.log(`tokenAddress: "${mockUSDT.address}"`);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
