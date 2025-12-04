/**
 * Supported blockchain networks for ChainFiliatess
 */

export interface BlockchainNetwork {
  chainId: number;
  chainName: string;
  displayName: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: string;
  isActive: boolean;
}

export const SUPPORTED_BLOCKCHAINS: Record<number, BlockchainNetwork> = {
  1: {
    chainId: 1,
    chainName: "ethereum",
    displayName: "Ethereum Mainnet",
    rpcUrl: "https://eth.llamarpc.com",
    explorerUrl: "https://etherscan.io",
    nativeCurrency: "ETH",
    isActive: true,
  },
  56: {
    chainId: 56,
    chainName: "bsc",
    displayName: "Binance Smart Chain",
    rpcUrl: "https://bsc-dataseed.binance.org",
    explorerUrl: "https://bscscan.com",
    nativeCurrency: "BNB",
    isActive: true,
  },
  43114: {
    chainId: 43114,
    chainName: "avalanche",
    displayName: "Avalanche C-Chain",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    explorerUrl: "https://snowtrace.io",
    nativeCurrency: "AVAX",
    isActive: true,
  },
  50: {
    chainId: 50,
    chainName: "xdc",
    displayName: "XDC Network",
    rpcUrl: "https://rpc.xinfin.network",
    explorerUrl: "https://xdcscan.com",
    nativeCurrency: "XDC",
    isActive: true,
  },
  8453: {
    chainId: 8453,
    chainName: "base",
    displayName: "Base",
    rpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
    nativeCurrency: "ETH",
    isActive: true,
  },
  59144: {
    chainId: 59144,
    chainName: "linea",
    displayName: "Linea",
    rpcUrl: "https://rpc.linea.build",
    explorerUrl: "https://lineascan.build",
    nativeCurrency: "ETH",
    isActive: true,
  },
  369: {
    chainId: 369,
    chainName: "pulsechain",
    displayName: "PulseChain",
    rpcUrl: "https://rpc.pulsechain.com",
    explorerUrl: "https://scan.pulsechain.com",
    nativeCurrency: "PLS",
    isActive: true,
  },
};

export const BLOCKCHAIN_ARRAY = Object.values(SUPPORTED_BLOCKCHAINS);

export const MONETIZATION_CONFIG = {
  monthlyFee: 150, // $150 USD per month
  commissionRate: 5, // 5% commission on affiliate payouts
  paymentWallet: "0x0bc01063610a23883110c95fab8951c818f4b7e2", // USDT payment recipient
  paymentToken: "USDT", // Payment token
};

export function getBlockchainByChainId(chainId: number): BlockchainNetwork | undefined {
  return SUPPORTED_BLOCKCHAINS[chainId];
}

export function getBlockchainByName(chainName: string): BlockchainNetwork | undefined {
  return Object.values(SUPPORTED_BLOCKCHAINS).find(
    (bc) => bc.chainName.toLowerCase() === chainName.toLowerCase()
  );
}
