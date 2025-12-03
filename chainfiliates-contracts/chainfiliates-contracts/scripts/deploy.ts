import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Configuration
  const TREASURY = process.env.TREASURY_ADDRESS || deployer.address;
  
  // USDC on Base mainnet: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
  // USDC on Base Sepolia: Use a mock or test token
  const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  const PAYMENT_TOKEN = process.env.PAYMENT_TOKEN || USDC_BASE;

  console.log("\n--- Deployment Configuration ---");
  console.log("Treasury:", TREASURY);
  console.log("Payment Token (USDC):", PAYMENT_TOKEN);
  console.log("--------------------------------\n");

  // Deploy Factory
  console.log("Deploying ChainFiliatesFactory...");
  const Factory = await ethers.getContractFactory("ChainFiliatesFactory");
  const factory = await Factory.deploy(TREASURY, PAYMENT_TOKEN);
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log("ChainFiliatesFactory deployed to:", factoryAddress);

  console.log("\n--- Deployment Complete ---");
  console.log("Factory:", factoryAddress);
  console.log("");
  console.log("Next steps:");
  console.log("1. Verify contracts on Basescan:");
  console.log(`   npx hardhat verify --network base ${factoryAddress} "${TREASURY}" "${PAYMENT_TOKEN}"`);
  console.log("");
  console.log("2. Update .env with deployed addresses");
  console.log("3. Test registration flow on testnet first");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
