 import { Contract, utils } from "ethers";
 import { TIMELOCK_CONTRACT_ABI, TIMELOCK_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI } from "../../constants";
 
 // Function that deposit erc20 token
    export const depositTokens = async(signer, amountWei)=>{
            // A signer is needed
            //const signer = await getProviderOrsigner(true);
            // create an instance of the contract
        const timelock = new Contract(TIMELOCK_CONTRACT_ADDRESS, TIMELOCK_CONTRACT_ABI, signer);
        const timelockToken = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer);

        let tx;
        // call the depositTokens from the contract
        tx = await timelockToken.approve(TIMELOCK_CONTRACT_ADDRESS, utils.parseEther(amountWei.toString()));
        await tx.wait();
        tx = await timelock.depositTokens(utils.parseEther(amountWei.toString()));
        await tx.wait();
    }