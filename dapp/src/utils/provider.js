import { ethers } from "ethers";
import { abi } from "./abi";

const contractAddress = "0x62131cCCA16141604cBbb704f389592Fe54ff859"; // 合约地址

const sepoliaTest =
  "https://sepolia.infura.io/v3/9e6d42be6ef4415a81df98ee13b20b0f";

export const rpcProvider = new ethers.providers.JsonRpcProvider(sepoliaTest);

export const getContract = (provider) => {
  if (!provider) {
    return new ethers.Contract(contractAddress, abi, rpcProvider); //只读合约
  } else {
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer); // 读写合约
  }
};
