import { BigNumber, providers, utils } from 'ethers';
import Head from "next/head";
import React, {useEffect, useRef, useState } from 'react';
import Web3Modal from 'web3modal';
import styles from "../styles/Home.module.css";
import { transferTokens, depositTokens, unlock5Percent } from './utils/transferTokens';

export default function Home(){
    const [loading, setLoading] = useState(0);
    const zero = BigNumber.from(0);
    // To keep track if a user's wallet is connected or not
    const [walletConected, setWalletConnected] = useState(false);
    const [amount, setAmount] = useState("");

    // create reference to web3modal which is used to connecting to metamask
    const web3ModalRef = useRef();

    // Function to deposit tokens to contract
    const _depositTokens = async()=>{
        try {
            const amountWei = utils.parseEther(amount);
            if (!amountWei.eq(zero)){
                const signer = await getProviderOrSigner(true);
                setLoading(true);
                await depositTokens(signer, amountWei);
                setLoading(false);
                setAmount("");
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
            setAmount("");
        }
    }

    // Fucntion to unlock 5 percent
    const _unlock5Percent = async() => {
        try {
            const signer = await getProviderOrSigner(true);
            setLoading(true);
            await unlock5Percent(signer);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    // Function to transfer tokens from contract to user
    const _transferTokens = async() => {
        try {
            const amountWei = utils.parseEther(amount);
            if (!amountWei.eq(zero)){
                const signer = await getProviderOrSigner(true);
                setLoading(true);
                await transferTokens(signer, amountWei);
                setLoading(false);
                setAmount("");
            }
            
        } catch (error) {
            console.error(error);
            setLoading(false);
            setAmount("");
        }
    }

    // Function to connect wallet
    const connectWallet = async()=>{
        try {
            await getProviderOrSigner();
            setWalletConnected(true);
        } catch (error) {
            console.error(error);
        }
    }

    // Function to determine if signer is need or not
    const getProviderOrSigner = async (needSigner = false)=>{
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);

        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 5){
            window.alert("Change the network to Goerli");
            throw new Error("Change network to Goerli");
        }

        if (needSigner){
            const signer = web3Provider.getSigner();
            return signer;
        }
        return web3Provider;
    }

    useEffect(() => {
        // Check if wallet connected, else, create a new instance web3modal
        // and connect the metamask wallet
        if (!walletConected){
            web3ModalRef.current = new Web3Modal({
                network: "goerli",
                providerOptions: {},
                disableInjectedProvider: false,
            });
            connectWallet();
        }
    }, [walletConected]);

    // function that renders button based on state of the dapp
    const renderButton = () => {
        // return button if wallet is not connected
        if(!walletConected) {
            return (
                <button onClick={connectWallet} className={styles.button}>
                    Connect your wallet
                </button>
            );
        }

        // If something is currently loading, return a loading button
        if (loading){
            return <button className={styles.button}>Loading...</button>;
        }else{
            return(
                <>
                    <input type="number" placeholder='Amount'
                    onChange={(e) => setAmount(e.target.value || "0")}
                    className={styles.input} />
                    <button className={styles.button} onClick={_depositTokens}>
                        Deposit Tokens
                    </button>
                    <button className={styles.button} onClick={_transferTokens}>
                        Withdraw Tokens
                    </button>
                    <button className={styles.button} onClick={_unlock5Percent}>
                        Unlock 5%
                    </button>
                </>
            );
        }
    }

    return(
        <div>
            <Head>
                <title>Token Lockup</title>
                <meta name="description" content="Token Vesting" />
            </Head>
            <div className={styles.main}>
                <div>
                    <h1 className={styles.title}>Welcome to your Vest</h1>

                </div>
                {renderButton()}
            </div>
            <footer className={styles.footer}>
                Made with &#10084; by iSmarty
            </footer>
        </div>
    );


}