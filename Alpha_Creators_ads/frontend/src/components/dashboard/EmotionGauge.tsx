import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { io } from "socket.io-client";

const data = [
    { name: 'Frustration', value: 33, color: '#ef4444' }, // Red
    { name: 'Excitement', value: 33, color: '#a855f7' }, // Purple
    { name: 'Joy', value: 33, color: '#3b82f6' }, // Blue
];

const cx = 150;
const cy = 150;
const iR = 80;
const oR = 120;

const needle = (value: number, data: any[], cx: number, cy: number, iR: number, oR: number, color: string) => {
    let total = 0;
    data.forEach((v) => {
        total += v.value;
    });
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-ang * Math.PI / 180);
    const cos = Math.cos(-ang * Math.PI / 180);
    const r = 5;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [
        <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" key="circle" />,
        <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill={color} key="path" />,
    ];
};

const EmotionGauge = () => {
    const [sentiment, setSentiment] = useState({ joy: 75, frustration: 10, excitement: 15 });

    useEffect(() => {
        const socket = io('http://localhost:8000');
        socket.on('sentiment_update', (data) => {
            setSentiment(data);
        });
        return () => socket.disconnect();
    }, []);

    // Calculate needle value based on dominant sentiment or a weighted average
    // For this visual, let's map it: Frustration (0-33), Excitement (33-66), Joy (66-100)
    // This is a simplification for the gauge visual
    const needleValue = (sentiment.frustration * 0.33) + (sentiment.excitement * 0.33) + (sentiment.joy * 0.33) + 20; // Offset for visual

    return (
        <Card className="h-full bg-card/50 backdrop-blur-xl border-border flex flex-col lightning-card shadow-sm">
            <CardHeader className="pb-2 text-center border-b border-border">
                <CardTitle className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Emotion Detection</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center relative p-6">
                <div className="relative w-[300px] h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                dataKey="value"
                                startAngle={180}
                                endAngle={0}
                                data={data}
                                cx={cx}
                                cy={cy}
                                innerRadius={iR}
                                outerRadius={oR}
                                fill="#8884d8"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            {needle(needleValue, data, cx, cy, iR, oR, '#888888')}
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute bottom-0 left-0 w-full flex justify-between px-8 text-xs font-bold uppercase tracking-widest">
                        <div className="text-red-500 text-center">
                            Frustration
                            <div className="text-lg">{sentiment.frustration}%</div>
                        </div>
                        <div className="text-purple-500 text-center">
                            Excitement
                            <div className="text-lg">{sentiment.excitement}%</div>
                        </div>
                        <div className="text-blue-500 text-center">
                            Joy
                            <div className="text-lg">{sentiment.joy}%</div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <h3 className="text-2xl font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">EMOTION DETECTION</h3>
                    <p className="text-xs text-muted-foreground mt-1">Real-time Audience Sentiment Analysis</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default EmotionGauge;
