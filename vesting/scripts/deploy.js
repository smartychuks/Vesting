const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env"});

async function main() {
  const timelockContract = await ethers.getContractFactory("Timelock");
 
  //deploy the contract
  const deployedTimelockContract = await timelockContract.deploy("0xC5C5453AbDe9C09C95b89bf5D218Dc3828f013aC");

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