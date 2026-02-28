import { Chain, createPublicClient, createWalletClient, http, WalletClient } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts'
import dotenv from 'dotenv'

dotenv.config()

// Creditcoin Testnet configuration
const creditcoinTestnet: Chain = {
  id: 102031,
  name: 'Creditcoin Testnet',
  nativeCurrency: {
    name: 'CTC',
    symbol: 'CTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.cc3-testnet.creditcoin.network'],
    },
    public: {
      http: ['https://rpc.cc3-testnet.creditcoin.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Creditcoin Testnet Explorer',
      url: 'https://creditcoin-testnet.blockscout.com/',
    },
  },
}

interface NetworkConfig {
    rpcProviderUrl: string
    blockExplorer: string
    chain: Chain
    nativeTokenAddress: Address
}

// Network configuration (Creditcoin Testnet)
const networkConfig: NetworkConfig = {
    rpcProviderUrl: 'https://rpc.cc3-testnet.creditcoin.network',
    blockExplorer: 'https://creditcoin-testnet.blockscout.com/',
    chain: creditcoinTestnet,
    nativeTokenAddress: '0x0000000000000000000000000000000000000000' as Address, // Native CTC token
}

// Use RPC_PROVIDER_URL only if it points to Creditcoin; otherwise always use Creditcoin RPC
// (avoids sending tx to wrong network when .env has an old URL like Base Sepolia)
function getRpcUrl(): string {
    const env = process.env.RPC_PROVIDER_URL?.trim()
    if (!env) return networkConfig.rpcProviderUrl
    if (env.toLowerCase().includes('creditcoin')) return env
    return networkConfig.rpcProviderUrl
}

// Helper functions
const validateEnvironmentVars = () => {
    if (!process.env.WALLET_PRIVATE_KEY) {
        throw new Error('WALLET_PRIVATE_KEY is required in .env file')
    }
}

// Initialize configuration
validateEnvironmentVars()

export const networkInfo = {
    ...networkConfig,
    rpcProviderUrl: getRpcUrl(),
}

export const account: Account = privateKeyToAccount(`0x${process.env.WALLET_PRIVATE_KEY}` as Address)

const baseConfig = {
    chain: networkInfo.chain,
    transport: http(networkInfo.rpcProviderUrl, {
        timeout: 60000, // 60 seconds timeout
        retryCount: 3,
        retryDelay: 1000,
    }),
} as const

export const publicClient = createPublicClient(baseConfig)
export const walletClient = createWalletClient({
    ...baseConfig,
    account,
}) as WalletClient

// Export constants
export const NATIVE_TOKEN_ADDRESS = networkInfo.nativeTokenAddress
export const BLOCK_EXPLORER_URL = networkInfo.blockExplorer
