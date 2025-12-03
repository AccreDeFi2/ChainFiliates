import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const CHAINS = [
  { id: 1, name: "ethereum", label: "Ethereum Mainnet" },
  { id: 56, name: "bsc", label: "Binance Smart Chain" },
  { id: 43114, name: "avalanche", label: "Avalanche C-Chain" },
  { id: 50, name: "xdc", label: "XDC Network" },
  { id: 8453, name: "base", label: "Base" },
  { id: 59144, name: "linea", label: "Linea" },
  { id: 369, name: "pulsechain", label: "PulseChain" },
];

const REWARD_TYPES = [
  { value: "ERC20", label: "ERC20 Token" },
  { value: "PST", label: "Profit Sharing Token (PST)" },
];

export default function CreateCampaign() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    chainId: number;
    chainName: string;
    rewardType: "ERC20" | "PST";
    rewardAddress: string;
    rewardSymbol: string;
    rewardDecimals: number;
    rewardPerReferral: string;
    campaignManagerAddress: string;
    totalBudget: string;
  }>({
    name: "",
    description: "",
    chainId: 1,
    chainName: "ethereum",
    rewardType: "ERC20",
    rewardAddress: "",
    rewardSymbol: "",
    rewardDecimals: 18,
    rewardPerReferral: "",
    campaignManagerAddress: "",
    totalBudget: "",
  });

  const createCampaignMutation = trpc.campaigns.create.useMutation({
    onSuccess: () => {
      toast.success("Campaign created successfully!");
      window.location.href = "/campaigns";
    },
    onError: (error) => {
      toast.error(`Error creating campaign: ${error.message}`);
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChainChange = (chainId: string) => {
    const chain = CHAINS.find((c) => c.id === Number(chainId));
    if (chain) {
      handleInputChange("chainId", chain.id);
      handleInputChange("chainName", chain.name);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.rewardAddress || !formData.rewardPerReferral || !formData.campaignManagerAddress) {
      toast.error("Please fill in all required fields");
      return;
    }

    createCampaignMutation.mutate(formData);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 cursor-pointer">
              EthFiliates
            </div>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${
                    step >= s
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                <p className="text-sm text-slate-600">
                  {s === 1 ? "Basic Info" : s === 2 ? "Reward Config" : "Review"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 ? "Campaign Basic Information" : step === 2 ? "Reward Configuration" : "Review & Create"}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Tell us about your affiliate program"
                : step === 2
                ? "Configure the reward token and amounts"
                : "Review your campaign settings"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., My Awesome Referral Program"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your campaign and what partners will be promoting"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="chain">Blockchain Network *</Label>
                  <Select value={formData.chainId.toString()} onValueChange={handleChainChange}>
                    <SelectTrigger id="chain" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CHAINS.map((chain) => (
                        <SelectItem key={chain.id} value={chain.id.toString()}>
                          {chain.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="managerAddress">Campaign Manager Wallet Address *</Label>
                  <Input
                    id="managerAddress"
                    placeholder="0x..."
                    value={formData.campaignManagerAddress}
                    onChange={(e) => handleInputChange("campaignManagerAddress", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Reward Config */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="rewardType">Reward Token Type *</Label>
                  <Select value={formData.rewardType} onValueChange={(value) => handleInputChange("rewardType", value)}>
                    <SelectTrigger id="rewardType" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REWARD_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="rewardAddress">Reward Token Contract Address *</Label>
                  <Input
                    id="rewardAddress"
                    placeholder="0x..."
                    value={formData.rewardAddress}
                    onChange={(e) => handleInputChange("rewardAddress", e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rewardSymbol">Token Symbol</Label>
                    <Input
                      id="rewardSymbol"
                      placeholder="e.g., USDC"
                      value={formData.rewardSymbol}
                      onChange={(e) => handleInputChange("rewardSymbol", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rewardDecimals">Token Decimals</Label>
                    <Input
                      id="rewardDecimals"
                      type="number"
                      placeholder="18"
                      value={formData.rewardDecimals}
                      onChange={(e) => handleInputChange("rewardDecimals", Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="rewardPerReferral">Reward Per Referral *</Label>
                  <Input
                    id="rewardPerReferral"
                    placeholder="e.g., 100"
                    value={formData.rewardPerReferral}
                    onChange={(e) => handleInputChange("rewardPerReferral", e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="totalBudget">Total Campaign Budget (Optional)</Label>
                  <Input
                    id="totalBudget"
                    placeholder="e.g., 10000"
                    value={formData.totalBudget}
                    onChange={(e) => handleInputChange("totalBudget", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">Campaign Name</p>
                    <p className="font-semibold text-slate-900">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Description</p>
                    <p className="text-slate-900">{formData.description || "No description provided"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Network</p>
                      <p className="font-semibold text-slate-900">{formData.chainName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Reward Type</p>
                      <p className="font-semibold text-slate-900">{formData.rewardType}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Reward Token Address</p>
                    <p className="font-mono text-sm text-slate-900 break-all">{formData.rewardAddress}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Reward Per Referral</p>
                      <p className="font-semibold text-slate-900">
                        {formData.rewardPerReferral} {formData.rewardSymbol}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Budget</p>
                      <p className="font-semibold text-slate-900">{formData.totalBudget || "Unlimited"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    Once created, your campaign will be in draft status. You can add partners and generate referral links after creation.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={createCampaignMutation.isPending}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  {createCampaignMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Create Campaign
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
