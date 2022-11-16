const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env"});

async function main() {
  const timelockContract = await ethers.getContractFactory("Timelock");
 
  //deploy the contract
  const deployedTimelockContract = await timelockContract.deploy("0xCA034E370686eb18eb7f63706338ab16f43e4644");

  // To display address of deployed contract
  console.log(
    "Timelock Contract Address:", deployedTimelockContract.address
  );
}

// call main function to catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });