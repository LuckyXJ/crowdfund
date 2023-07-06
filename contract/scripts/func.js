const { ethers } = require("hardhat");

async function main() {
  const args = process.argv;

  if (args.myParam) {
    console.log(`My parameter value: ${args.myParam}`);
  } else {
    console.log("My parameter is not set", args);
  }
}

main();