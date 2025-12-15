import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Zap,
  Shield,
  Palette,
  Users,
  TrendingUp,
  Target,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { AIAdGenerator } from '@/components/AIAdGenerator';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { EthicalAIControls } from '@/components/EthicalAIControls';
import { RealTimeCustomization } from '@/components/RealTimeCustomization';
import VideoGeneratorButton from '@/components/VideoGeneratorButton';
import { useAdStore } from '@/stores/adStore';
import { useUserStore } from '@/stores/userStore';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

const Generate = () => {
  const { generatedAds, campaigns, templates } = useAdStore();
  const { currentUser } = useUserStore();
  const { analytics } = useAnalyticsStore();
  const navigate = useNavigate();

  const totalAds = generatedAds.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const avgPerformance = analytics?.performance?.totalClicks && analytics?.performance?.totalImpressions
    ? ((analytics.performance.totalClicks / analytics.performance.totalImpressions) * 100).toFixed(2)
    : '0.00';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          <header className="h-20 border-b border-border flex items-center justify-between px-6 bg-background/90 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">AI Ad Generation Studio</h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Create, customize, and optimize your ads with AI assistance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Free Plan</Badge>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Data
              </Button>
            </div>
          </header>

          <div className="flex-1 p-6 md:p-8 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Ads</p>
                      <p className="text-2xl font-bold">{totalAds}</p>
                    </div>
                    <Zap className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                      <p className="text-2xl font-bold">{activeCampaigns}</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg CTR</p>
                      <p className="text-2xl font-bold">{avgPerformance}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Templates</p>
                      <p className="text-2xl font-bold">{templates.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="generator" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="generator" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  AI Generator
                </TabsTrigger>
                <TabsTrigger value="customization" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Customize
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="ethics" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Ethics & AI
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generator" className="mt-6">
                <div className="space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">AI-Powered Content Generation</h2>
                      <p className="text-muted-foreground">Generate ads, visuals, and videos with AI</p>
                    </div>
                    <VideoGeneratorButton />
                  </div>
                  <AIAdGenerator />
                </div>
              </TabsContent>

              <TabsContent value="customization" className="mt-6">
                <RealTimeCustomization />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <AnalyticsDashboard />
              </TabsContent>

              <TabsContent value="ethics" className="mt-6">
                <EthicalAIControls />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Generate;