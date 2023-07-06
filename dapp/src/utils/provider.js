import { ethers } from "ethers";
import { abi } from "./abi";

const contractAddress = "0x07A945f9E586bA293e692E2cE71A3967c70cb3C8"; // 合约地址

const sepoliaTest =
  "https://sepolia.infura.io/v3/9e6d42be6ef4415a81df98ee13b20b0f";

export const rpcProvider = new ethers.providers.JsonRpcProvider(sepoliaTest);

export const getContract = (provider) => {
  if (!provider) {
    return new ethers.Contract(contractAddress, abi, rpcProvider); //只读合约
  } else {
    const key =
      "c11ce0b7969f358c5f28bb937766de4f4434a9333b0b97db5a9e1d39afb98b5a";
    const wallet = new ethers.Wallet(key, provider);
    return new ethers.Contract(contractAddress, abi, wallet); // 读写合约
  }
};
