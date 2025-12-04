import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

const data = [
    { name: 'Mon', clicks: 400, impressions: 2400 },
    { name: 'Tue', clicks: 300, impressions: 1398 },
    { name: 'Wed', clicks: 200, impressions: 9800 },
    { name: 'Thu', clicks: 278, impressions: 3908 },
    { name: 'Fri', clicks: 189, impressions: 4800 },
    { name: 'Sat', clicks: 239, impressions: 3800 },
    { name: 'Sun', clicks: 349, impressions: 4300 },
];

const AdPerformanceChart = () => {
    return (
        <Card className="bg-card/50 backdrop-blur-xl border-border lightning-card shadow-sm">
            <CardHeader className="pb-2 border-b border-border flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Ad Performance Graphs</CardTitle>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} vertical={false} />
                            <XAxis dataKey="name" stroke="currentColor" strokeOpacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="currentColor" strokeOpacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Area type="monotone" dataKey="clicks" stroke="#3b82f6" fillOpacity={1} fill="url(#colorClicks)" strokeWidth={2} />
                            <Area type="monotone" dataKey="impressions" stroke="#06b6d4" fillOpacity={1} fill="url(#colorImpressions)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdPerformanceChart;
