"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox-viem");
require("@nomicfoundation/hardhat-verify");
const config_1 = require("hardhat/config");
if (!config_1.vars.has("DEPLOYER_PRIVATE_KEY")) {
    console.error("Missing env var DEPLOYER_PRIVATE_KEY");
}
const deployerPrivateKey = config_1.vars.get("DEPLOYER_PRIVATE_KEY");
const config = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1,
            },
        },
    },
    networks: {
        creditcoinMainnet: {
            url: "https://mainnet3.creditcoin.network",
            accounts: [deployerPrivateKey],
            timeout: 120000, // 120 seconds
        },
        creditcoinTestnet: {
            url: "https://rpc.cc3-testnet.creditcoin.network",
            accounts: [deployerPrivateKey],
            timeout: 120000, // 120 seconds
            gas: 30000000, // Creditcoin may need explicit gas for large contract deploys
        },
    },
    etherscan: {
        apiKey: {
            creditcoinMainnet: "YOU_CAN_COPY_ME",
            creditcoinTestnet: "YOU_CAN_COPY_ME",
        },
        customChains: [
            {
                network: "creditcoinMainnet",
                chainId: 102030,
                urls: {
                    apiURL: "https://creditcoin.blockscout.com/api",
                    browserURL: "https://creditcoin.blockscout.com/",
                },
            },
            {
                network: "creditcoinTestnet",
                chainId: 102031,
                urls: {
                    apiURL: "https://creditcoin-testnet.blockscout.com/api",
                    browserURL: "https://creditcoin-testnet.blockscout.com/",
                },
            },
        ],
    },
    sourcify: {
        // Disabled by default
        // Doesn't need an API key
        enabled: false,
    },
};
exports.default = config;
