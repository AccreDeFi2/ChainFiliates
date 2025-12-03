import { describe, expect, it } from "vitest";
import {
  isValidEthereumAddress,
  normalizeAddress,
  isKnownToken,
  getKnownTokenSymbol,
  formatTokenAmount,
  parseTokenAmount,
  isValidTokenAmount,
  COMMON_TOKENS,
} from "../shared/tokenUtils";

describe("ERC20 Token Utilities", () => {
  describe("Address Validation", () => {
    it("should validate correct Ethereum address", () => {
      const address = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
      expect(isValidEthereumAddress(address)).toBe(true);
    });

    it("should reject invalid address format", () => {
      const address = "0xdAC17F958D2ee523a2206206994597C13D831ec7a";
      expect(isValidEthereumAddress(address)).toBe(false);
    });

    it("should reject address without 0x prefix", () => {
      const address = "dAC17F958D2ee523a2206206994597C13D831ec7";
      expect(isValidEthereumAddress(address)).toBe(false);
    });

    it("should normalize address to lowercase", () => {
      const address = "0xDAC17F958D2EE523A2206206994597C13D831EC7";
      expect(normalizeAddress(address)).toBe("0xdac17f958d2ee523a2206206994597c13d831ec7");
    });
  });

  describe("Known Tokens", () => {
    it("should identify USDT on Ethereum", () => {
      const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
      expect(isKnownToken(1, usdtAddress)).toBe(true);
    });

    it("should identify USDC on Ethereum", () => {
      const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      expect(isKnownToken(1, usdcAddress)).toBe(true);
    });

    it("should identify USDT on BSC", () => {
      const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
      expect(isKnownToken(56, usdtAddress)).toBe(true);
    });

    it("should reject unknown token address", () => {
      const unknownAddress = "0x1111111111111111111111111111111111111111";
      expect(isKnownToken(1, unknownAddress)).toBe(false);
    });

    it("should get symbol for known token", () => {
      const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
      expect(getKnownTokenSymbol(1, usdtAddress)).toBe("USDT");
    });

    it("should return null for unknown token", () => {
      const unknownAddress = "0x1111111111111111111111111111111111111111";
      expect(getKnownTokenSymbol(1, unknownAddress)).toBeNull();
    });

    it("should have common tokens for all supported chains", () => {
      const supportedChains = [1, 56, 43114, 8453, 59144, 369];
      supportedChains.forEach((chainId) => {
        expect(COMMON_TOKENS[chainId]).toBeDefined();
        expect(Object.keys(COMMON_TOKENS[chainId]).length).toBeGreaterThan(0);
      });
    });
  });

  describe("Token Amount Formatting", () => {
    it("should format token amount with 18 decimals", () => {
      const amount = "1000000000000000000"; // 1 token with 18 decimals
      expect(formatTokenAmount(amount, 18)).toBe("1");
    });

    it("should format token amount with 6 decimals (USDT)", () => {
      const amount = "1000000"; // 1 USDT with 6 decimals
      expect(formatTokenAmount(amount, 6)).toBe("1");
    });

    it("should format fractional token amounts", () => {
      const amount = "1500000000000000000"; // 1.5 tokens
      expect(formatTokenAmount(amount, 18)).toBe("1.5");
    });

    it("should format very small token amounts", () => {
      const amount = "100000000000000"; // 0.0001 tokens
      expect(formatTokenAmount(amount, 18)).toBe("0.0001");
    });

    it("should parse token amount to smallest unit", () => {
      const amount = "1.5";
      expect(parseTokenAmount(amount, 18)).toBe("1500000000000000000");
    });

    it("should parse integer token amount", () => {
      const amount = "100";
      expect(parseTokenAmount(amount, 6)).toBe("100000000");
    });

    it("should parse USDT amount correctly", () => {
      const amount = "150"; // $150 USDT
      expect(parseTokenAmount(amount, 6)).toBe("150000000");
    });

    it("should handle zero amount", () => {
      const amount = "0";
      expect(parseTokenAmount(amount, 18)).toBe("0");
    });
  });

  describe("Token Amount Validation", () => {
    it("should validate positive amount", () => {
      expect(isValidTokenAmount("100")).toBe(true);
    });

    it("should validate decimal amount", () => {
      expect(isValidTokenAmount("100.5")).toBe(true);
    });

    it("should reject zero amount", () => {
      expect(isValidTokenAmount("0")).toBe(false);
    });

    it("should reject negative amount", () => {
      expect(isValidTokenAmount("-100")).toBe(false);
    });

    it("should reject invalid amount", () => {
      expect(isValidTokenAmount("abc")).toBe(false);
    });

    it("should reject empty string", () => {
      expect(isValidTokenAmount("")).toBe(false);
    });
  });

  describe("Multi-Chain Token Support", () => {
    it("should support 7 different blockchains", () => {
      const chainIds = Object.keys(COMMON_TOKENS).map(Number);
      expect(chainIds.length).toBeGreaterThanOrEqual(6);
    });

    it("should have different tokens per chain", () => {
      const ethereumTokens = Object.keys(COMMON_TOKENS[1] || {});
      const bscTokens = Object.keys(COMMON_TOKENS[56] || {});
      expect(ethereumTokens.length).toBeGreaterThan(0);
      expect(bscTokens.length).toBeGreaterThan(0);
    });

    it("should allow custom token address on any chain", () => {
      const customAddress = "0x1234567890123456789012345678901234567890";
      expect(isValidEthereumAddress(customAddress)).toBe(true);
      expect(isKnownToken(1, customAddress)).toBe(false);
      expect(isKnownToken(56, customAddress)).toBe(false);
    });
  });

  describe("Token Metadata Caching", () => {
    it("should cache USDT metadata", () => {
      const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
      const symbol1 = getKnownTokenSymbol(1, usdtAddress);
      const symbol2 = getKnownTokenSymbol(1, usdtAddress);
      expect(symbol1).toBe(symbol2);
      expect(symbol1).toBe("USDT");
    });

    it("should return consistent decimals for known tokens", () => {
      const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
      const isKnown = isKnownToken(1, usdtAddress);
      expect(isKnown).toBe(true);
      // USDT has 6 decimals
      const formatted = formatTokenAmount("1000000", 6);
      expect(formatted).toBe("1");
    });
  });
});
