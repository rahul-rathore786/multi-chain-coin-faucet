const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Deploying on network:", network.name);

  // Deploy MockUSDT
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy(
    "Mock USDT", // Name
    "mUSDT", // Symbol
    18, // Decimals
    1000000000000 // Initial supply (1 billion tokens)
  );
  await mockUSDT.deployed();
  console.log(`MockUSDT deployed to: ${mockUSDT.address}`);

  // Deploy TokenFaucet
  const TokenFaucet = await ethers.getContractFactory("TokenFaucet");
  const tokenFaucet = await TokenFaucet.deploy(
    mockUSDT.address,
    ethers.utils.parseUnits("1000", 18)
  );
  await tokenFaucet.deployed();
  console.log(`TokenFaucet deployed to: ${tokenFaucet.address}`);

  // --- Save contract addresses ---
  const addresses = {
    tokenAddress: mockUSDT.address,
    faucetAddress: tokenFaucet.address,
  };
  saveContractAddresses(addresses);

  // --- Fund the faucet contract ---
  console.log("\nFunding the faucet contract...");
  const amount = ethers.utils.parseUnits("1000000000", 18); // 1 billion tokens
  const tx = await mockUSDT.transfer(tokenFaucet.address, amount);
  await tx.wait();
  console.log(
    `Transferred ${ethers.utils.formatUnits(
      amount,
      18
    )} mUSDT to the faucet at ${tokenFaucet.address}`
  );

  console.log("\nDeployment complete!");
}

function saveContractAddresses(newAddresses) {
  const addressesDir = path.join(__dirname, "..");
  const addressesPath = path.join(addressesDir, "addresses.json");

  let existingAddresses = {};
  if (fs.existsSync(addressesPath)) {
    try {
      existingAddresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
    } catch (e) {
      console.error("Error parsing existing addresses.json, starting fresh.");
    }
  }

  // Add or update the addresses for the current network
  existingAddresses[network.name] = newAddresses;

  fs.writeFileSync(
    addressesPath,
    JSON.stringify(existingAddresses, null, 2) // Pretty print JSON
  );

  console.log(
    `\nContract addresses saved for network '${network.name}' to: ${addressesPath}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
