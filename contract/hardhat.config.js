require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.5.0",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/9e6d42be6ef4415a81df98ee13b20b0f",
      accounts: ["c11ce0b7969f358c5f28bb937766de4f4434a9333b0b97db5a9e1d39afb98b5a"],
      chainId: 11155111,
    },
  }
};


// c11ce0b7969f358c5f28bb937766de4f4434a9333b0b97db5a9e1d39afb98b5a
