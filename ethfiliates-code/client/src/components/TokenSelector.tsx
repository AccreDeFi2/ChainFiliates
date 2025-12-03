import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { isValidEthereumAddress, COMMON_TOKENS, getKnownTokenSymbol } from "@shared/tokenUtils";
import { toast } from "sonner";

interface TokenSelectorProps {
  chainId: number;
  onTokenSelect: (tokenAddress: string, symbol: string, decimals: number) => void;
  selectedToken?: string;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  chainId,
  onTokenSelect,
  selectedToken,
}) => {
  const [tokenAddress, setTokenAddress] = useState(selectedToken || "");
  const [isValidating, setIsValidating] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<{
    symbol: string;
    decimals: number;
    name?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const commonTokens = COMMON_TOKENS[chainId] || {};

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setTokenAddress(address);
    setError(null);
    setTokenInfo(null);
  };

  const validateToken = async () => {
    if (!tokenAddress) {
      setError("Please enter a token address");
      return;
    }

    if (!isValidEthereumAddress(tokenAddress)) {
      setError("Invalid Ethereum address format");
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      // Check if it's a known token
      const knownSymbol = getKnownTokenSymbol(chainId, tokenAddress);
      if (knownSymbol) {
        setTokenInfo({
          symbol: knownSymbol,
          decimals: knownSymbol === "USDT" || knownSymbol === "USDC" ? 6 : 18,
          name: knownSymbol,
        });
        onTokenSelect(tokenAddress, knownSymbol, knownSymbol === "USDT" || knownSymbol === "USDC" ? 6 : 18);
        toast.success(`Token ${knownSymbol} detected!`);
        return;
      }

      // For custom tokens, we would normally call the contract to get metadata
      // For now, we'll assume 18 decimals (standard for most ERC20 tokens)
      // In production, you'd fetch this from the blockchain
      const symbol = `TOKEN-${tokenAddress.substring(2, 8).toUpperCase()}`;
      setTokenInfo({
        symbol,
        decimals: 18,
        name: "Custom ERC20 Token",
      });
      onTokenSelect(tokenAddress, symbol, 18);
      toast.success("Token address validated!");
    } catch (err) {
      setError("Failed to validate token. Please check the address.");
      console.error("Token validation error:", err);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold mb-3 block">Reward Token</Label>
        <p className="text-sm text-slate-600 mb-4">
          Select a token to pay your affiliates. You can use any ERC20 token on this blockchain.
        </p>
      </div>

      {/* Common Tokens Quick Select */}
      {Object.keys(commonTokens).length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Popular Tokens</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(commonTokens).map(([symbol, address]) => (
              <Button
                key={address}
                variant={selectedToken === address ? "default" : "outline"}
                onClick={() => {
                  setTokenAddress(address);
                  setTokenInfo({ symbol, decimals: symbol === "USDT" || symbol === "USDC" ? 6 : 18 });
                  onTokenSelect(address, symbol, symbol === "USDT" || symbol === "USDC" ? 6 : 18);
                }}
                className="text-sm"
              >
                {symbol}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Token Input */}
      <div>
        <Label htmlFor="token-address" className="text-sm font-medium">
          Custom Token Address
        </Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="token-address"
            placeholder="0x..."
            value={tokenAddress}
            onChange={handleAddressChange}
            className="flex-1 font-mono text-sm"
          />
          <Button
            onClick={validateToken}
            disabled={isValidating || !tokenAddress}
            className="px-4"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              "Validate"
            )}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Token Info */}
      {tokenInfo && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-green-900">Token Confirmed</p>
                <div className="text-sm text-green-800 space-y-1">
                  <p>
                    <span className="font-medium">Symbol:</span> {tokenInfo.symbol}
                  </p>
                  <p>
                    <span className="font-medium">Decimals:</span> {tokenInfo.decimals}
                  </p>
                  {tokenInfo.name && (
                    <p>
                      <span className="font-medium">Name:</span> {tokenInfo.name}
                    </p>
                  )}
                  <p className="font-mono text-xs mt-2 break-all">{tokenAddress}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
