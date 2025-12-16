import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  TrendingUp,
  Target,
  Play,
  Settings
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Defs,
  LinearGradient,
  Stop
} from "recharts";

const data = [
  { name: "Jan", clickRate: 4.2, conversions: 1200 },
  { name: "Feb", clickRate: 5.8, conversions: 1900 },
  { name: "Mar", clickRate: 4.9, conversions: 1500 },
  { name: "Apr", clickRate: 6.5, conversions: 2400 },
  { name: "May", clickRate: 7.2, conversions: 2800 },
  { name: "Jun", clickRate: 8.5, conversions: 3500 },
  { name: "Jul", clickRate: 8.7, conversions: 3800 },
];

export const DashboardPreview = () => {
  return (
    <section id="analytics" className="py-36">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Advanced{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Analytics Dashboard
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Monitor campaign performance, user engagement, and AI model effectiveness
            with our comprehensive analytics platform.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-card rounded-2xl p-8 shadow-elevated border border-border/50">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">Campaign Dashboard</h3>
                <p className="text-muted-foreground">Real-time insights and performance metrics</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="analytics" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Live Mode
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary">Click Rate</span>
                </div>
                <div className="text-2xl font-bold mb-1">8.7%</div>
                <div className="text-sm text-muted-foreground">+23% from last week</div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-accent">Reach</span>
                </div>
                <div className="text-2xl font-bold mb-1">124.3K</div>
                <div className="text-sm text-muted-foreground">+15% this month</div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                  </div>
                  <span className="text-sm font-medium text-orange-500">Conversions</span>
                </div>
                <div className="text-2xl font-bold mb-1">2,847</div>
                <div className="text-sm text-muted-foreground">+31% vs target</div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Target className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-blue-500">Accuracy</span>
                </div>
                <div className="text-2xl font-bold mb-1">94.2%</div>
                <div className="text-sm text-muted-foreground">AI targeting score</div>
              </Card>
            </div>

            {/* Recharts Implementation */}
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold">Performance Trends</h4>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-[#8b5cf6] rounded-full"></div>
                    <span>Click Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-[#06b6d4] rounded-full"></div>
                    <span>Conversions</span>
                  </div>
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorClickRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      axisLine={false}
                      tickLine={false}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderColor: '#334155',
                        borderRadius: '0.5rem',
                        color: '#f8fafc'
                      }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="clickRate"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#colorClickRate)"
                      strokeWidth={3}
                    />
                    <Area
                      type="monotone"
                      dataKey="conversions"
                      stroke="#06b6d4"
                      fillOpacity={1}
                      fill="url(#colorConversions)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};