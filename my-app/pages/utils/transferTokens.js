import { Contract, utils } from "ethers";
import { TIMELOCK_CONTRACT_ABI, TIMELOCK_CONTRACT_ADDRESS } from "../../constants";

 // Function to send erc20 from contract to a user's address
export const transferTokens = async(signer, amountWei)=>{
    // create an instance of the contract
    const timelock = new Contract(TIMELOCK_CONTRACT_ADDRESS, TIMELOCK_CONTRACT_ABI, signer);
    let tx;
    //to interact with the function from contract
    tx = await timelock.transferTokens(utils.parseEther(amountWei.toString()));
    await tx.wait();
}