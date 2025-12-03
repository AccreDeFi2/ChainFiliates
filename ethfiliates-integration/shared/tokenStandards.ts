/**
 * Token Standards Module
 * Supports multiple token standards across different blockchains:
 * - ERC20: Ethereum, Avalanche, Base, Linea
 * - BEP20: Binance Smart Chain
 * - PRC20: PulseChain
 * - XRC20: XDC Network
 */

export type TokenStandard = "ERC20" | "BEP20" | "PRC20" | "XRC20";

export interface TokenStandardConfig {
  standard: TokenStandard;
  name: string;
  description: string;
  decimalsDefault: number;
  abi: any[];
}

export interface ChainTokenConfig {
  chainId: number;
  chainName: string;
  standard: TokenStandard;
  nativeCurrency: string;
  rpcUrl: string;
  explorerUrl: string;
}

/**
 * Token Standard Configurations
 */
export const TOKEN_STANDARDS: Record<TokenStandard, TokenStandardConfig> = {
  ERC20: {
    standard: "ERC20",
    name: "ERC20 (Ethereum Request for Comments 20)",
    description: "Standard token interface used on Ethereum and EVM-compatible chains",
    decimalsDefault: 18,
    abi: [
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
    ],
  },

  BEP20: {
    standard: "BEP20",
    name: "BEP20 (Binance Evolution Proposal 20)",
    description: "Token standard used on Binance Smart Chain (BSC), based on ERC20 with BSC-specific optimizations",
    decimalsDefault: 18,
    abi: [
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
    ],
  },

  PRC20: {
    standard: "PRC20",
    name: "PRC20 (PulseChain Token Standard)",
    description: "Token standard used on PulseChain network (based on ERC20 with PulseChain modifications)",
    decimalsDefault: 18,
    abi: [
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
    ],
  },

  XRC20: {
    standard: "XRC20",
    name: "XRC20 (XDC Network Token Standard)",
    description: "Token standard used on XDC Network (based on ERC20 with XDC modifications)",
    decimalsDefault: 18,
    abi: [
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
    ],
  },
};

/**
 * Chain to Token Standard Mapping
 */
export const CHAIN_TOKEN_STANDARDS: Record<number, ChainTokenConfig> = {
  1: {
    chainId: 1,
    chainName: "Ethereum Mainnet",
    standard: "ERC20",
    nativeCurrency: "ETH",
    rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/demo",
    explorerUrl: "https://etherscan.io",
  },
  56: {
    chainId: 56,
    chainName: "Binance Smart Chain",
    standard: "BEP20",
    nativeCurrency: "BNB",
    rpcUrl: "https://bsc-dataseed.bnbchain.org:443",
    explorerUrl: "https://bscscan.com",
  },
  43114: {
    chainId: 43114,
    chainName: "Avalanche C-Chain",
    standard: "ERC20",
    nativeCurrency: "AVAX",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    explorerUrl: "https://snowtrace.io",
  },
  50: {
    chainId: 50,
    chainName: "XDC Network",
    standard: "XRC20",
    nativeCurrency: "XDC",
    rpcUrl: "https://rpc.xinfin.network",
    explorerUrl: "https://xdcscan.com",
  },
  8453: {
    chainId: 8453,
    chainName: "Base",
    standard: "ERC20",
    nativeCurrency: "ETH",
    rpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
  },
  59144: {
    chainId: 59144,
    chainName: "Linea",
    standard: "ERC20",
    nativeCurrency: "ETH",
    rpcUrl: "https://rpc.linea.build",
    explorerUrl: "https://lineascan.build",
  },
  369: {
    chainId: 369,
    chainName: "PulseChain",
    standard: "PRC20",
    nativeCurrency: "PLS",
    rpcUrl: "https://rpc.pulsechain.com",
    explorerUrl: "https://scan.pulsechain.com",
  },
};

/**
 * Get token standard for a specific chain
 */
export function getTokenStandardForChain(chainId: number): TokenStandard {
  const config = CHAIN_TOKEN_STANDARDS[chainId];
  return config?.standard || "ERC20"; // Default to ERC20 for unknown chains
}

/**
 * Get chain configuration
 */
export function getChainConfig(chainId: number): ChainTokenConfig | null {
  return CHAIN_TOKEN_STANDARDS[chainId] || null;
}

/**
 * Get token standard configuration
 */
export function getTokenStandardConfig(standard: TokenStandard): TokenStandardConfig {
  return TOKEN_STANDARDS[standard];
}

/**
 * Get all supported chains with their token standards
 */
export function getSupportedChains(): ChainTokenConfig[] {
  return Object.values(CHAIN_TOKEN_STANDARDS);
}

/**
 * Check if a chain uses a specific token standard
 */
export function chainUsesStandard(chainId: number, standard: TokenStandard): boolean {
  const config = CHAIN_TOKEN_STANDARDS[chainId];
  return config?.standard === standard;
}

/**
 * Get all chains using a specific token standard
 */
export function getChainsUsingStandard(standard: TokenStandard): ChainTokenConfig[] {
  return Object.values(CHAIN_TOKEN_STANDARDS).filter((config) => config.standard === standard);
}

/**
 * Get description of token standard for a chain
 */
export function getTokenStandardDescription(chainId: number): string {
  const standard = getTokenStandardForChain(chainId);
  const config = getTokenStandardConfig(standard);
  return `${config.name}: ${config.description}`;
}

/**
 * Validate token standard compatibility
 */
export function isTokenStandardCompatible(chainId: number, tokenStandard: TokenStandard): boolean {
  const chainStandard = getTokenStandardForChain(chainId);
  return chainStandard === tokenStandard;
}
