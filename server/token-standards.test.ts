import { describe, expect, it } from "vitest";
import {
  getTokenStandardForChain,
  getChainConfig,
  getTokenStandardConfig,
  getSupportedChains,
  chainUsesStandard,
  getChainsUsingStandard,
  getTokenStandardDescription,
  isTokenStandardCompatible,
  CHAIN_TOKEN_STANDARDS,
  TOKEN_STANDARDS,
} from "../shared/tokenStandards";

describe("Token Standards Across Blockchains", () => {
  describe("Chain Token Standard Detection", () => {
    it("should detect ERC20 for Ethereum", () => {
      expect(getTokenStandardForChain(1)).toBe("ERC20");
    });

    it("should detect BEP20 for BSC", () => {
      expect(getTokenStandardForChain(56)).toBe("BEP20");
    });

    it("should detect ERC20 for Avalanche", () => {
      expect(getTokenStandardForChain(43114)).toBe("ERC20");
    });

    it("should detect ERC20 for Base", () => {
      expect(getTokenStandardForChain(8453)).toBe("ERC20");
    });

    it("should detect ERC20 for Linea", () => {
      expect(getTokenStandardForChain(59144)).toBe("ERC20");
    });

    it("should detect PRC20 for PulseChain", () => {
      expect(getTokenStandardForChain(369)).toBe("PRC20");
    });

    it("should detect XRC20 for XDC Network", () => {
      expect(getTokenStandardForChain(50)).toBe("XRC20");
    });

    it("should default to ERC20 for unknown chains", () => {
      expect(getTokenStandardForChain(999)).toBe("ERC20");
    });
  });

  describe("Chain Configuration", () => {
    it("should get Ethereum configuration", () => {
      const config = getChainConfig(1);
      expect(config).toBeDefined();
      expect(config?.chainName).toBe("Ethereum Mainnet");
      expect(config?.standard).toBe("ERC20");
      expect(config?.nativeCurrency).toBe("ETH");
    });

    it("should get PulseChain configuration", () => {
      const config = getChainConfig(369);
      expect(config).toBeDefined();
      expect(config?.chainName).toBe("PulseChain");
      expect(config?.standard).toBe("PRC20");
      expect(config?.nativeCurrency).toBe("PLS");
    });

    it("should get XDC Network configuration", () => {
      const config = getChainConfig(50);
      expect(config).toBeDefined();
      expect(config?.chainName).toBe("XDC Network");
      expect(config?.standard).toBe("XRC20");
      expect(config?.nativeCurrency).toBe("XDC");
    });

    it("should return null for unknown chain", () => {
      const config = getChainConfig(999);
      expect(config).toBeNull();
    });

    it("should have RPC URLs for all chains", () => {
      Object.values(CHAIN_TOKEN_STANDARDS).forEach((config) => {
        expect(config.rpcUrl).toBeDefined();
        expect(config.rpcUrl.length).toBeGreaterThan(0);
      });
    });

    it("should have explorer URLs for all chains", () => {
      Object.values(CHAIN_TOKEN_STANDARDS).forEach((config) => {
        expect(config.explorerUrl).toBeDefined();
        expect(config.explorerUrl.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Token Standard Configuration", () => {
    it("should have ERC20 configuration", () => {
      const config = getTokenStandardConfig("ERC20");
      expect(config.standard).toBe("ERC20");
      expect(config.name).toBeDefined();
      expect(config.description).toBeDefined();
      expect(config.abi).toBeDefined();
      expect(config.abi.length).toBeGreaterThan(0);
    });

    it("should have PRC20 configuration", () => {
      const config = getTokenStandardConfig("PRC20");
      expect(config.standard).toBe("PRC20");
      expect(config.name).toContain("PulseChain");
      expect(config.abi).toBeDefined();
    });

    it("should have XRC20 configuration", () => {
      const config = getTokenStandardConfig("XRC20");
      expect(config.standard).toBe("XRC20");
      expect(config.name).toContain("XDC");
      expect(config.abi).toBeDefined();
    });

    it("should have transfer function in all ABIs", () => {
      Object.values(TOKEN_STANDARDS).forEach((config) => {
        const transferFunc = config.abi.find((func) => func.name === "transfer");
        expect(transferFunc).toBeDefined();
      });
    });

    it("should have balanceOf function in all ABIs", () => {
      Object.values(TOKEN_STANDARDS).forEach((config) => {
        const balanceFunc = config.abi.find((func) => func.name === "balanceOf");
        expect(balanceFunc).toBeDefined();
      });
    });
  });

  describe("Supported Chains", () => {
    it("should have 7 supported chains", () => {
      const chains = getSupportedChains();
      expect(chains.length).toBe(7);
    });

    it("should include all major blockchains", () => {
      const chains = getSupportedChains();
      const chainIds = chains.map((c) => c.chainId);
      expect(chainIds).toContain(1); // Ethereum
      expect(chainIds).toContain(56); // BSC
      expect(chainIds).toContain(43114); // Avalanche
      expect(chainIds).toContain(50); // XDC
      expect(chainIds).toContain(8453); // Base
      expect(chainIds).toContain(59144); // Linea
      expect(chainIds).toContain(369); // PulseChain
    });
  });

  describe("Chain Standard Compatibility", () => {
    it("should verify Ethereum uses ERC20", () => {
      expect(chainUsesStandard(1, "ERC20")).toBe(true);
    });

    it("should verify BSC uses BEP20", () => {
      expect(chainUsesStandard(56, "BEP20")).toBe(true);
    });

    it("should verify PulseChain uses PRC20", () => {
      expect(chainUsesStandard(369, "PRC20")).toBe(true);
    });

    it("should verify XDC uses XRC20", () => {
      expect(chainUsesStandard(50, "XRC20")).toBe(true);
    });

    it("should reject wrong standard for chain", () => {
      expect(chainUsesStandard(1, "BEP20")).toBe(false);
      expect(chainUsesStandard(56, "ERC20")).toBe(false);
      expect(chainUsesStandard(369, "ERC20")).toBe(false);
      expect(chainUsesStandard(50, "PRC20")).toBe(false);
    });
  });

  describe("Chains by Standard", () => {
    it("should get all ERC20 chains", () => {
      const erc20Chains = getChainsUsingStandard("ERC20");
      expect(erc20Chains.length).toBe(4); // Ethereum, Avalanche, Base, Linea
      expect(erc20Chains.map((c) => c.chainId)).toContain(1);
      expect(erc20Chains.map((c) => c.chainId)).not.toContain(56);
    });

    it("should get all BEP20 chains", () => {
      const bep20Chains = getChainsUsingStandard("BEP20");
      expect(bep20Chains.length).toBe(1); // BSC
      expect(bep20Chains[0]?.chainId).toBe(56);
    });

    it("should get all XRC20 chains", () => {
      const xrc20Chains = getChainsUsingStandard("XRC20");
      expect(xrc20Chains.length).toBe(1); // XDC Network
      expect(xrc20Chains[0]?.chainId).toBe(50);
    });
  });

  describe("Token Standard Descriptions", () => {
    it("should get description for Ethereum", () => {
      const desc = getTokenStandardDescription(1);
      expect(desc).toContain("ERC20");
      expect(desc).toContain("Ethereum");
    });

    it("should get description for BSC", () => {
      const desc = getTokenStandardDescription(56);
      expect(desc).toContain("BEP20");
      expect(desc).toContain("Binance");
    });

    it("should get description for PulseChain", () => {
      const desc = getTokenStandardDescription(369);
      expect(desc).toContain("PRC20");
      expect(desc).toContain("PulseChain");
    });

    it("should get description for XDC", () => {
      const desc = getTokenStandardDescription(50);
      expect(desc).toContain("XRC20");
      expect(desc).toContain("XDC");
    });
  });

  describe("Token Standard Compatibility", () => {
    it("should verify ERC20 compatibility on Ethereum", () => {
      expect(isTokenStandardCompatible(1, "ERC20")).toBe(true);
    });

    it("should verify BEP20 compatibility on BSC", () => {
      expect(isTokenStandardCompatible(56, "BEP20")).toBe(true);
    });

    it("should verify PRC20 compatibility on PulseChain", () => {
      expect(isTokenStandardCompatible(369, "PRC20")).toBe(true);
    });

    it("should verify XRC20 compatibility on XDC", () => {
      expect(isTokenStandardCompatible(50, "XRC20")).toBe(true);
    });

    it("should reject incompatible standards", () => {
      expect(isTokenStandardCompatible(1, "BEP20")).toBe(false);
      expect(isTokenStandardCompatible(56, "ERC20")).toBe(false);
      expect(isTokenStandardCompatible(369, "ERC20")).toBe(false);
      expect(isTokenStandardCompatible(50, "PRC20")).toBe(false);
    });
  });

  describe("Token Standard Metadata", () => {
    it("should have correct default decimals for ERC20", () => {
      const config = getTokenStandardConfig("ERC20");
      expect(config.decimalsDefault).toBe(18);
    });

    it("should have correct default decimals for BEP20", () => {
      const config = getTokenStandardConfig("BEP20");
      expect(config.decimalsDefault).toBe(18);
    });

    it("should have correct default decimals for PRC20", () => {
      const config = getTokenStandardConfig("PRC20");
      expect(config.decimalsDefault).toBe(18);
    });

    it("should have correct default decimals for XRC20", () => {
      const config = getTokenStandardConfig("XRC20");
      expect(config.decimalsDefault).toBe(18);
    });
  });
});
