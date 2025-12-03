import React, { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  description: string;
  recipientAddress: string;
  tokenAddress: string;
  chainId: number;
  onPaymentSuccess?: (txHash: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  description,
  recipientAddress,
  tokenAddress,
  chainId,
  onPaymentSuccess,
}) => {
  const { account, isConnected, connectWallet, chainId: userChainId, switchNetwork, sendPayment } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (userChainId !== chainId) {
      try {
        await switchNetwork(chainId);
      } catch (err) {
        setError("Failed to switch network. Please switch manually in MetaMask.");
        return;
      }
    }

    setIsProcessing(true);
    setError(null);

    try {
      const hash = await sendPayment(recipientAddress, amount, tokenAddress);
      setTxHash(hash);
      toast.success("Payment sent successfully!");
      onPaymentSuccess?.(hash);
      setTimeout(() => {
        onClose();
        setTxHash(null);
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.message || "Payment failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>Review and confirm your payment details</DialogDescription>
        </DialogHeader>

        {txHash ? (
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-semibold text-green-700">Payment Successful!</p>
              <p className="text-sm text-slate-600">Transaction Hash:</p>
              <p className="text-xs font-mono bg-slate-100 p-2 rounded break-all">{txHash}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input value={`${amount} USDT`} disabled className="bg-slate-50" />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={description} disabled className="bg-slate-50" />
            </div>

            <div className="space-y-2">
              <Label>Recipient</Label>
              <Input
                value={recipientAddress}
                disabled
                className="bg-slate-50 text-xs font-mono"
              />
            </div>

            {error && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {!isConnected && (
              <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>Please connect your wallet to proceed with payment.</p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} disabled={isProcessing} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Payment"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
