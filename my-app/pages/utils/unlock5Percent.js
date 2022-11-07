import { Contract, utils } from "ethers";
import { TIMELOCK_CONTRACT_ABI, TIMELOCK_CONTRACT_ADDRESS } from "../../constants";

// Function to unlock 5 percent
export const unlock5Percent = async(signer)=>{
    const timelock = new Contract(TIMELOCK_CONTRACT_ADDRESS, TIMELOCK_CONTRACT_ABI, signer);
    let tx;
    tx = await timelock.unlock5Percent();
    await tx.wait();
}