import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DataService from '@/services/dataService';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Target,
  Shield,
  AlertTriangle,
  CheckCircle,
  Download,
  Loader2
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const Analytics = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const data = await DataService.getAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast({
        title: "Error loading analytics",
        description: "Failed to fetch analytics data. Using demo data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Performance Trends Data (Last 30 days)
  const performanceData = analyticsData?.timeSeriesData || [
    { date: 'Oct 15', impressions: 12000, clicks: 980, conversions: 156, revenue: 2340 },
    { date: 'Oct 17', impressions: 15000, clicks: 1200, conversions: 189, revenue: 2835 },
    { date: 'Oct 19', impressions: 18000, clicks: 1440, conversions: 225, revenue: 3375 },
    { date: 'Oct 21', impressions: 16500, clicks: 1320, conversions: 198, revenue: 2970 },
    { date: 'Oct 23', impressions: 21000, clicks: 1680, conversions: 252, revenue: 3780 },
    { date: 'Oct 25', impressions: 24000, clicks: 1920, conversions: 288, revenue: 4320 },
    { date: 'Oct 27', impressions: 22500, clicks: 1800, conversions: 270, revenue: 4050 },
    { date: 'Oct 29', impressions: 27000, clicks: 2160, conversions: 324, revenue: 4860 },
    { date: 'Oct 31', impressions: 25500, clicks: 2040, conversions: 306, revenue: 4590 },
    { date: 'Nov 2', impressions: 30000, clicks: 2400, conversions: 360, revenue: 5400 },
    { date: 'Nov 4', impressions: 28500, clicks: 2280, conversions: 342, revenue: 5130 },
    { date: 'Nov 6', impressions: 33000, clicks: 2640, conversions: 396, revenue: 5940 },
    { date: 'Nov 8', impressions: 31500, clicks: 2520, conversions: 378, revenue: 5670 },
    { date: 'Nov 10', impressions: 36000, clicks: 2880, conversions: 432, revenue: 6480 },
    { date: 'Nov 12', impressions: 34500, clicks: 2760, conversions: 414, revenue: 6210 },
  ];

  // Audience Demographics Data
  const audienceData = analyticsData?.demographics || [
    { name: '18-24', value: 2400, percentage: 18 },
    { name: '25-34', value: 4800, percentage: 36 },
    { name: '35-44', value: 3200, percentage: 24 },
    { name: '45-54', value: 1600, percentage: 12 },
    { name: '55+', value: 1200, percentage: 10 },
  ];

  // CTR by Platform
  const platformData = analyticsData?.platformPerformance || [
    { platform: 'Facebook', ctr: 8.5, impressions: 125000, clicks: 10625 },
    { platform: 'Instagram', ctr: 9.2, impressions: 98000, clicks: 9016 },
    { platform: 'Twitter', ctr: 6.8, impressions: 85000, clicks: 5780 },
    { platform: 'LinkedIn', ctr: 7.9, impressions: 67000, clicks: 5293 },
    { platform: 'TikTok', ctr: 11.3, impressions: 145000, clicks: 16385 },
  ];

  // Campaign Performance
  const campaignData = [
    { name: 'Summer Sale', roi: 4.8, spend: 12000, revenue: 57600 },
    { name: 'Product Launch', roi: 3.9, spend: 8500, revenue: 33150 },
    { name: 'Brand Awareness', roi: 5.2, spend: 15000, revenue: 78000 },
    { name: 'Holiday Special', roi: 4.1, spend: 10000, revenue: 41000 },
    { name: 'Retargeting', roi: 6.3, spend: 5000, revenue: 31500 },
  ];

  const COLORS = ['#8b5cf6', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Performance Analytics</h1>
              <p className="text-muted-foreground">
                Comprehensive insights into your AI-powered advertising performance
              </p>
            </div>
            <Button variant="outline" onClick={loadAnalyticsData} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Loading...' : 'Refresh Data'}
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Total Revenue</span>
              </div>
              <div className="text-2xl font-bold">$47,234</div>
              <div className="text-sm text-muted-foreground">+23% vs last month</div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-accent">Total Reach</span>
              </div>
              <div className="text-2xl font-bold">2.4M</div>
              <div className="text-sm text-muted-foreground">Unique users reached</div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-accent-orange/10 to-accent-orange/5 border-accent-orange/20">
              <div className="flex items-center gap-3 mb-3">
                <Target className="h-5 w-5 text-accent-orange" />
                <span className="text-sm font-medium text-accent-orange">Avg CTR</span>
              </div>
              <div className="text-2xl font-bold">8.7%</div>
              <div className="text-sm text-muted-foreground">Industry: 2.3%</div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 border-accent-blue/20">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-5 w-5 text-accent-blue" />
                <span className="text-sm font-medium text-accent-blue">ROAS</span>
              </div>
              <div className="text-2xl font-bold">4.2x</div>
              <div className="text-sm text-muted-foreground">Return on ad spend</div>
            </Card>
          </div>

          {/* AI Ethics Dashboard */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">AI Ethics & Bias Monitoring</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-accent" />
                <div>
                  <div className="font-medium">Fairness Score</div>
                  <div className="text-sm text-muted-foreground">94% - Excellent</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-accent-orange/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-accent-orange" />
                <div>
                  <div className="font-medium">Bias Detection</div>
                  <div className="text-sm text-muted-foreground">2 minor issues found</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-medium">Compliance</div>
                  <div className="text-sm text-muted-foreground">IEEE 7003-2024</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Trends Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Trends - Last 30 Days</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)" 
                  name="Revenue ($)"
                />
                <Area 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorClicks)" 
                  name="Clicks"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* CTR and Demographics */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Platform Performance */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">CTR by Platform</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis 
                    dataKey="platform" 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="ctr" name="CTR (%)" radius={[8, 8, 0, 0]}>
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            
            {/* Audience Demographics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Audience Demographics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={audienceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {audienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Campaign ROI Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Campaign ROI Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="roi" name="ROI (x)" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Impressions vs Conversions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Impressions vs Conversions Trend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="impressions" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Impressions"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;