import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Eye } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Campaigns() {
  const { user, loading: authLoading } = useAuth();
  const { data: campaigns, isLoading, error } = trpc.campaigns.list.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-slate-100 text-slate-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 cursor-pointer">
              ChainFiliatess
            </div>
          </Link>
          <Link href="/campaigns/new">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Campaigns</h1>
          <p className="text-slate-600">Manage your affiliate programs</p>
        </div>

        {error && (
          <Card className="bg-red-50 border-red-200 mb-6">
            <CardContent className="pt-6 text-red-800">
              Error loading campaigns: {error.message}
            </CardContent>
          </Card>
        )}

        {!campaigns || campaigns.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-slate-600 mb-6">No campaigns yet. Create your first one to get started.</p>
              <Link href="/campaigns/new">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-lg transition">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{campaign.name}</CardTitle>
                      <CardDescription className="mt-1">{campaign.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-600">Chain</p>
                      <p className="font-semibold text-slate-900">{campaign.chainName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Reward Type</p>
                      <p className="font-semibold text-slate-900">{campaign.rewardType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Referrals</p>
                      <p className="font-semibold text-slate-900">{campaign.totalReferrals}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Reward per Referral</p>
                      <p className="font-semibold text-slate-900">{campaign.rewardPerReferral} {campaign.rewardSymbol}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/campaigns/${campaign.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
