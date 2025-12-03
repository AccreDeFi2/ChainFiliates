import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserProvider, Contract, parseUnits } from "ethers";

export interface WalletContextType {
  account: string | null;
  chainId: number | null;
  balance: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  sendPayment: (toAddress: string, amount: string, tokenAddress: string) => Promise<string>;
  getUSDTBalance: (tokenAddress: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkWalletConnection();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    if (!window.ethereum) return;
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
        const balance = await provider.getBalance(accounts[0].address);
        setBalance(balance.toString());
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setBalance(null);
    } else {
      setAccount(accounts[0]);
      checkWalletConnection();
    }
  };

  const handleChainChanged = () => {
    checkWalletConnection();
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to continue.");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      checkWalletConnection();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setBalance(null);
  };

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      checkWalletConnection();
    } catch (error: any) {
      if (error.code === 4902) {
        console.error("Network not found in MetaMask");
      } else {
        console.error("Error switching network:", error);
      }
    }
  };

  const sendPayment = async (toAddress: string, amount: string, tokenAddress: string): Promise<string> => {
    if (!account || !window.ethereum) throw new Error("Wallet not connected");

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // USDT ABI (minimal - only transfer function)
    const USDT_ABI = [
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
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
      {
        constant: true,
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        type: "function",
      },
    ];

    const contract = new Contract(tokenAddress, USDT_ABI, signer);

    // Get decimals
    const decimals = await contract.decimals();
    const amountInUnits = parseUnits(amount, decimals);

    // Send transfer transaction
    const tx = await contract.transfer(toAddress, amountInUnits);
    const receipt = await tx.wait();

    return receipt.hash;
  };

  const getUSDTBalance = async (tokenAddress: string): Promise<string> => {
    if (!account || !window.ethereum) return "0";

    const provider = new BrowserProvider(window.ethereum);

    const USDT_ABI = [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
      {
        constant: true,
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        type: "function",
      },
    ];

    const contract = new Contract(tokenAddress, USDT_ABI, provider);
    const balance = await contract.balanceOf(account);
    const decimals = await contract.decimals();

    return (Number(balance) / Math.pow(10, decimals)).toFixed(2);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        balance,
        isConnecting,
        isConnected: !!account,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        sendPayment,
        getUSDTBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
};

declare global {
  interface Window {
    ethereum?: any;
  }
}
