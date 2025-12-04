import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { io } from "socket.io-client";

interface Campaign {
    name: string;
    status: string;
    progress: number;
}

const CampaignWidgets = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([
        { name: 'Summer Sale', status: 'Active', progress: 75 },
        { name: 'Q4 Launch', status: 'Pending', progress: 30 },
    ]);

    useEffect(() => {
        const socket = io('http://localhost:8000');
        socket.on('campaign_update', (data) => {
            setCampaigns(data);
        });
        return () => socket.disconnect();
    }, []);

    return (
        <Card className="bg-card/50 backdrop-blur-xl border-border lightning-card shadow-sm">
            <CardHeader className="pb-2 border-b border-border">
                <CardTitle className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Campaign Status Widgets</CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {campaigns.map((campaign, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4 border border-border">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase">
                                {campaign.status} :: {campaign.name}
                            </span>
                        </div>
                        <Progress value={campaign.progress} className="h-2 mb-2" />
                        <div className="flex justify-end">
                            <span className="text-xs text-primary">{campaign.progress}%</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default CampaignWidgets;
