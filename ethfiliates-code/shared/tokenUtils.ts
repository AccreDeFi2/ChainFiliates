/**
 * Token utility functions for ERC20 token handling
 */

export interface TokenMetadata {
  address: string;
  symbol: string;
  decimals: number;
  name?: string;
  isValid: boolean;
}

/**
 * Validate Ethereum address format
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Normalize Ethereum address to lowercase
 */
export function normalizeAddress(address: string): string {
  return address.toLowerCase();
}

/**
 * ERC20 ABI for token interactions
 */
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
];

/**
 * Common token addresses across different chains
 */
export const COMMON_TOKENS: Record<number, Record<string, string>> = {
  1: {
    // Ethereum Mainnet
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  56: {
    // Binance Smart Chain
    USDT: "0x55d398326f99059fF775485246999027B3197955",
    USDC: "0x8AC76a51cc950d9822D68b83FE1Ad97B32Cd580d",
    BUSD: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    WBNB: "0xbb4CdB9CBd36B01bD1cbaAFc2141F2B0d78BD857",
  },
  43114: {
    // Avalanche C-Chain
    USDT: "0x9702230A8657203E2F74BfE482454Ef4D4F7f4eB",
    USDC: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    DAI: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
    WAVAX: "0xB31f1d825DC94c4b0A1Da22B3700CFB1d4FA47B1",
  },
  8453: {
    // Base
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    DAI: "0x50c5725949A6F0c72E6C4a641F14122319E53fdc",
    WETH: "0x4200000000000000000000000000000000000006",
  },
  59144: {
    // Linea
    USDC: "0xA219439258ca9253cC80642D5422C3f1D1e39E27",
    WETH: "0xe5D7C2a44FfDDf6d6A67DcA519979A7EB7EB1c86",
  },
  369: {
    // PulseChain
    USDC: "0x15E26D435923eb60e77DD577a07EE0d8f07c4abe",
    WPLS: "0xA1077a294dDE1B09bB078844df4d8f00692eeDF6",
  },
};

/**
 * Get RPC URL for a specific chain
 */
export const RPC_URLS: Record<number, string> = {
  1: "https://eth-mainnet.g.alchemy.com/v2/demo",
  56: "https://bsc-dataseed.bnbchain.org:443",
  43114: "https://api.avax.network/ext/bc/C/rpc",
  50: "https://rpc.xinfin.network",
  8453: "https://mainnet.base.org",
  59144: "https://rpc.linea.build",
  369: "https://rpc.pulsechain.com",
};

/**
 * Validate if a token address is a common known token
 */
export function isKnownToken(chainId: number, address: string): boolean {
  const normalizedAddress = normalizeAddress(address);
  const chainTokens = COMMON_TOKENS[chainId];
  if (!chainTokens) return false;
  return Object.values(chainTokens).some((addr) => normalizeAddress(addr) === normalizedAddress);
}

/**
 * Get token symbol from known tokens
 */
export function getKnownTokenSymbol(chainId: number, address: string): string | null {
  const normalizedAddress = normalizeAddress(address);
  const chainTokens = COMMON_TOKENS[chainId];
  if (!chainTokens) return null;
  for (const [symbol, addr] of Object.entries(chainTokens)) {
    if (normalizeAddress(addr) === normalizedAddress) {
      return symbol;
    }
  }
  return null;
}

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(amount: string, decimals: number): string {
  const num = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const integerPart = num / divisor;
  const fractionalPart = num % divisor;

  if (fractionalPart === BigInt(0)) {
    return integerPart.toString();
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${integerPart}.${fractionalStr}`;
}

/**
 * Parse token amount to smallest unit (wei-like)
 */
export function parseTokenAmount(amount: string, decimals: number): string {
  const parts = amount.split(".");
  const integerPart = parts[0] || "0";
  let fractionalPart = parts[1] || "";

  fractionalPart = fractionalPart.padEnd(decimals, "0").substring(0, decimals);

  const result = integerPart + fractionalPart;
  return result || "0";
}

/**
 * Validate token amount
 */
export function isValidTokenAmount(amount: string): boolean {
  try {
    const num = parseFloat(amount);
    return num > 0 && !isNaN(num);
  } catch {
    return false;
  }
}
