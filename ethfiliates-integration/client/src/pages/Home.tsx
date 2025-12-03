import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Zap, Users, TrendingUp, ArrowRight } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              EthFiliates
            </div>
            <a href={getLoginUrl()} className="text-slate-300 hover:text-white transition">
              Sign In
            </a>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Launch Your Affiliate Program
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Without Code
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              A No-Code Affiliate Program for Ethereum and other EVM based businesses
            </p>
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition">
              <CardHeader>
                <Zap className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Quick Setup</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Create a campaign in minutes with our intuitive wizard. No technical knowledge needed.
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition">
              <CardHeader>
                <Users className="w-8 h-8 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Manage Partners</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Easily onboard affiliates, generate referral links, and track their performance.
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Monitor clicks, conversions, and rewards distribution in real-time.
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to launch your affiliate program?</h2>
            <p className="text-slate-300 mb-6">Join hundreds of projects using EthFiliates to power their growth.</p>
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                Start Free Trial
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            EthFiliates
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">Welcome, {user?.name || "User"}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Create and manage no-code affiliate programs on Ethereum and EVM chains</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link href="/campaigns/new">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Create New Campaign
                </CardTitle>
                <CardDescription>Launch a new affiliate program</CardDescription>
              </CardHeader>
              <CardContent className="text-slate-600">
                Set up reward tokens, configure partners, and start tracking referrals.
              </CardContent>
            </Card>
          </Link>

          <Link href="/campaigns">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                  View All Campaigns
                </CardTitle>
                <CardDescription>Manage existing campaigns</CardDescription>
              </CardHeader>
              <CardContent className="text-slate-600">
                View campaign performance, manage partners, and track referrals.
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-2">
            <p>1. Create a new campaign with your reward token configuration</p>
            <p>2. Add partners and generate unique referral links for each</p>
            <p>3. Share links with your community and track performance in real-time</p>
            <p>4. Manage payouts and rewards distribution from the dashboard</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
