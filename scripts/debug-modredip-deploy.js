/**
 * Debug script: simulate ModredIP deployment on Creditcoin Testnet to capture revert reason.
 * Run: node scripts/debug-modredip-deploy.js
 * Requires: DEPLOYER_PRIVATE_KEY in env
 */
const { createPublicClient, http, decodeErrorResult, encodeDeployData } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

const chain = {
  id: 102031,
  name: 'Creditcoin Testnet',
  nativeCurrency: { name: 'CTC', symbol: 'CTC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.cc3-testnet.creditcoin.network'] } },
};

// From ignition/deployments/chain-102031/deployed_addresses.json
const REGISTRY_ADDRESS = '0xE9053cD4c52039C79b1ED2708558eCcdd8Cc6706';
const ACCOUNT_IMPL_ADDRESS = '0x9be86cb3691785f591DE11aa398863B89241B677';
const CHAIN_ID = 102031;

async function main() {
  const pk = process.env.DEPLOYER_PRIVATE_KEY;
  if (!pk) {
    console.error('Set DEPLOYER_PRIVATE_KEY');
    process.exit(1);
  }
  const account = privateKeyToAccount(Buffer.from(pk.replace(/^0x/, ''), 'hex'));
  const transport = http(chain.rpcUrls.default.http[0], { timeout: 30_000 });
  const publicClient = createPublicClient({ chain, transport });

  // Load ModredIP artifact from Ignition deployment artifacts
  const path = require('path');
  const artifactPath = path.join(__dirname, '../ignition/deployments/chain-102031/artifacts/ModredIPModule#ModredIP.json');
  const artifact = require(artifactPath);
  const bytecode = artifact.bytecode;
  const abi = artifact.abi;

  // Constructor args: (address registry, address accountImpl, uint256 chainId, address platformFeeCollector)
  const deployData = encodeDeployData({
    abi,
    bytecode,
    args: [REGISTRY_ADDRESS, ACCOUNT_IMPL_ADDRESS, BigInt(CHAIN_ID), account.address],
  });

  console.log('Simulating ModredIP deployment on Creditcoin Testnet...');
  console.log('Registry:', REGISTRY_ADDRESS);
  console.log('AccountImpl:', ACCOUNT_IMPL_ADDRESS);
  console.log('ChainId:', CHAIN_ID);
  console.log('FeeCollector:', account.address);
  console.log('');

  try {
    const gas = await publicClient.estimateGas({
      account: account.address,
      data: deployData,
      value: 0n,
    });
    console.log('Estimated gas:', gas.toString());
  } catch (err) {
    console.error('estimateGas failed (this often gives the revert reason):');
    console.error(err.message || err);
    if (err.cause) {
      console.error('Cause:', err.cause.message || err.cause);
      if (err.cause.data) console.error('Revert data (hex):', err.cause.data);
    }
    if (err.details) console.error('Details:', err.details);
    // Try to decode revert data if present
    const revertData = err.cause?.data || err.data || err.result;
    if (revertData && typeof revertData === 'string' && revertData.startsWith('0x')) {
      try {
        const decoded = decodeErrorResult({ data: revertData, abi });
        console.error('Decoded error:', decoded);
      } catch (_) {}
    }
  }

  // Report bytecode size (EIP-170 limit 24576 bytes)
  const bytecodeBytes = Buffer.from(bytecode.slice(2), 'hex');
  console.log('');
  console.log('ModredIP deployment bytecode size:', bytecodeBytes.length, 'bytes (EIP-170 max 24576)');
  if (bytecodeBytes.length > 24576) {
    console.log('WARNING: Contract exceeds EIP-170 size limit. Creditcoin may enforce this.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
