import { describe, expect, it } from "vitest";
import { SUPPORTED_BLOCKCHAINS, BLOCKCHAIN_ARRAY, getBlockchainByChainId, getBlockchainByName, MONETIZATION_CONFIG } from "../shared/blockchains";

describe("Blockchain Configurations", () => {
  it("should have all 7 supported blockchains", () => {
    expect(BLOCKCHAIN_ARRAY).toHaveLength(7);
  });

  it("should include Ethereum mainnet", () => {
    const eth = getBlockchainByChainId(1);
    expect(eth).toBeDefined();
    expect(eth?.chainName).toBe("ethereum");
    expect(eth?.displayName).toBe("Ethereum Mainnet");
  });

  it("should include Binance Smart Chain", () => {
    const bsc = getBlockchainByChainId(56);
    expect(bsc).toBeDefined();
    expect(bsc?.chainName).toBe("bsc");
    expect(bsc?.displayName).toBe("Binance Smart Chain");
  });

  it("should include Avalanche C-Chain", () => {
    const avax = getBlockchainByChainId(43114);
    expect(avax).toBeDefined();
    expect(avax?.chainName).toBe("avalanche");
    expect(avax?.displayName).toBe("Avalanche C-Chain");
  });

  it("should include XDC Network", () => {
    const xdc = getBlockchainByChainId(50);
    expect(xdc).toBeDefined();
    expect(xdc?.chainName).toBe("xdc");
    expect(xdc?.displayName).toBe("XDC Network");
  });

  it("should include Base", () => {
    const base = getBlockchainByChainId(8453);
    expect(base).toBeDefined();
    expect(base?.chainName).toBe("base");
    expect(base?.displayName).toBe("Base");
  });

  it("should include Linea", () => {
    const linea = getBlockchainByChainId(59144);
    expect(linea).toBeDefined();
    expect(linea?.chainName).toBe("linea");
    expect(linea?.displayName).toBe("Linea");
  });

  it("should include PulseChain", () => {
    const pulse = getBlockchainByChainId(369);
    expect(pulse).toBeDefined();
    expect(pulse?.chainName).toBe("pulsechain");
    expect(pulse?.displayName).toBe("PulseChain");
  });

  it("should find blockchain by name", () => {
    const eth = getBlockchainByName("ethereum");
    expect(eth).toBeDefined();
    expect(eth?.chainId).toBe(1);
  });

  it("should find blockchain by name case-insensitive", () => {
    const bsc = getBlockchainByName("BSC");
    expect(bsc).toBeDefined();
    expect(bsc?.chainId).toBe(56);
  });

  it("should return undefined for unknown chain ID", () => {
    const unknown = getBlockchainByChainId(999999);
    expect(unknown).toBeUndefined();
  });

  it("should return undefined for unknown chain name", () => {
    const unknown = getBlockchainByName("unknown");
    expect(unknown).toBeUndefined();
  });

  it("should have valid RPC URLs", () => {
    BLOCKCHAIN_ARRAY.forEach((blockchain) => {
      expect(blockchain.rpcUrl).toBeTruthy();
      expect(blockchain.rpcUrl).toMatch(/^https?:\/\//);
    });
  });

  it("should have valid explorer URLs", () => {
    BLOCKCHAIN_ARRAY.forEach((blockchain) => {
      expect(blockchain.explorerUrl).toBeTruthy();
      expect(blockchain.explorerUrl).toMatch(/^https?:\/\//);
    });
  });

  it("should have all blockchains active", () => {
    BLOCKCHAIN_ARRAY.forEach((blockchain) => {
      expect(blockchain.isActive).toBe(true);
    });
  });
});

describe("Monetization Configuration", () => {
  it("should have $150 monthly fee", () => {
    expect(MONETIZATION_CONFIG.monthlyFee).toBe(150);
  });

  it("should have 5% commission rate", () => {
    expect(MONETIZATION_CONFIG.commissionRate).toBe(5);
  });

  it("should have correct payment wallet", () => {
    expect(MONETIZATION_CONFIG.paymentWallet).toBe("0x0bc01063610a23883110c95fab8951c818f4b7e2");
  });

  it("should accept USDT as payment token", () => {
    expect(MONETIZATION_CONFIG.paymentToken).toBe("USDT");
  });

  it("should calculate 5% commission correctly", () => {
    const totalPayout = 1000;
    const commission = (totalPayout * MONETIZATION_CONFIG.commissionRate) / 100;
    expect(commission).toBe(50);
  });

  it("should calculate monthly revenue correctly", () => {
    const monthlySubscription = MONETIZATION_CONFIG.monthlyFee;
    const totalPayouts = 10000;
    const commission = (totalPayouts * MONETIZATION_CONFIG.commissionRate) / 100;
    const totalRevenue = monthlySubscription + commission;
    expect(totalRevenue).toBe(150 + 500);
  });
});
