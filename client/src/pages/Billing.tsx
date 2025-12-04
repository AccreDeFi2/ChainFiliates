import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BillingTransaction } from "../../../drizzle/schema";
import { Loader2, CreditCard, TrendingUp, DollarSign, Wallet } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { PaymentModal } from "@/components/PaymentModal";
import { useWallet } from "@/contexts/WalletContext";

export default function Billing() {
  const { user, loading: authLoading } = useAuth();
  const { data: subscription, isLoading: subscriptionLoading } = trpc.billing.getSubscription.useQuery();
  const { data: transactions, isLoading: transactionsLoading } = trpc.billing.getTransactions.useQuery();
  const { isConnected } = useWallet();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState(1);

  if (authLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-slate-600">Please sign in to view billing information.</p>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 cursor-pointer">
              ChainFiliatess
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">Welcome, {user?.name || "User"}</span>
            <WalletConnectButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Billing & Subscription</h1>
          <p className="text-slate-600">Manage your ChainFiliatess subscription and view payment history</p>
        </div>

        {/* Subscription Status */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Subscription Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Current Status</p>
                  <Badge className={statusColors[subscription?.status || "active"]}>
                    {subscription?.status?.toUpperCase() || "ACTIVE"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Monthly Fee</p>
                  <p className="text-2xl font-bold text-slate-900">${subscription?.monthlyFee || "150"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Commission Rate</p>
                  <p className="text-lg font-semibold text-slate-900">{subscription?.commissionRate || "5"}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Next Billing Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Next Payment Due</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {subscription?.nextBillingDate
                      ? new Date(subscription.nextBillingDate).toLocaleDateString()
                      : "Not scheduled"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Last Billed</p>
                  <p className="text-sm text-slate-700">
                    {subscription?.lastBilledDate
                      ? new Date(subscription.lastBilledDate).toLocaleDateString()
                      : "No billing history"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-600" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Accepted Payment</p>
                  <Badge className="bg-blue-100 text-blue-800">USDT (EVM Chains)</Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Recipient Wallet</p>
                  <p className="text-xs font-mono text-slate-700 break-all">
                    0x0bc01063610a23883110c95fab8951c818f4b7e2
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        {isConnected && (
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Pay with Wallet
              </CardTitle>
              <CardDescription>Pay your subscription using USDT on any supported blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Select Blockchain</label>
                  <select
                    value={selectedChainId}
                    onChange={(e) => setSelectedChainId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Ethereum Mainnet</option>
                    <option value={56}>Binance Smart Chain</option>
                    <option value={43114}>Avalanche C-Chain</option>
                    <option value={50}>XDC Network</option>
                    <option value={8453}>Base</option>
                    <option value={59144}>Linea</option>
                    <option value={369}>PulseChain</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Amount (USDT)</label>
                  <input
                    type="text"
                    value="150.00"
                    disabled
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                  />
                </div>
              </div>
              <Button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                Pay Monthly Subscription
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>All transactions and commissions</CardDescription>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin w-6 h-6" />
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Commission</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx: any) => (
                      <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-700">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-slate-700 capitalize">{tx.transactionType}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">${tx.amount}</td>
                        <td className="py-3 px-4 text-slate-700">{tx.commissionAmount ? `$${tx.commissionAmount}` : "-"}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              tx.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : tx.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {tx.status?.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600">No transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Info */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">ChainFiliatess Pricing</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-3">
            <p className="font-semibold">Your subscription includes:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>$150 USD per month subscription fee</li>
              <li>5% commission on all affiliate payouts</li>
              <li>Support for 7 EVM blockchains (Ethereum, BSC, Avalanche, XDC, Base, Linea, PulseChain)</li>
              <li>Unlimited campaigns and partners</li>
              <li>Real-time analytics and reporting</li>
              <li>USDT payments to your wallet</li>
            </ul>
          </CardContent>
        </Card>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount="150"
          description="ChainFiliatess Monthly Subscription"
          recipientAddress="0x0bc01063610a23883110c95fab8951c818f4b7e2"
          tokenAddress="0xdAC17F958D2ee523a2206206994597C13D831ec7"
          chainId={selectedChainId}
          onPaymentSuccess={(txHash) => {
            toast.success(`Payment confirmed: ${txHash}`);
          }}
        />
      </div>
    </div>
  );
}
