import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Smile, Frown, Meh } from "lucide-react";

const profiles = [
    { id: 1, name: 'Emotional Journey', user: 'User A', journey: ['positive', 'neutral', 'positive', 'positive'] },
    { id: 2, name: 'Emotional Journey', user: 'User B', journey: ['negative', 'neutral', 'negative', 'neutral'] },
    { id: 3, name: 'Emotional Journey', user: 'User C', journey: ['neutral', 'positive', 'positive', 'positive'] },
];

const CustomerProfileCards = () => {
    return (
        <Card className="bg-card/50 backdrop-blur-xl border-border h-full lightning-card shadow-sm">
            <CardHeader className="pb-2 border-b border-border flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Customer Profile Cards</CardTitle>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 gap-4">
                {profiles.map((profile) => (
                    <div key={profile.id} className="bg-muted/50 rounded-lg p-3 border border-border">
                        <div className="flex items-center gap-2 mb-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{profile.user[5]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="text-xs font-bold text-muted-foreground uppercase">{profile.name}</div>
                                <div className="text-sm font-semibold">{profile.user}</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {['Time', 'Time'].map((label, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1 w-full">
                                        <div className="h-1 flex-1 bg-primary/10 rounded-full overflow-hidden flex gap-0.5">
                                            {profile.journey.map((mood, j) => (
                                                <div
                                                    key={j}
                                                    className={`flex-1 h-full ${mood === 'positive' ? 'bg-green-500' :
                                                            mood === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        {i === 0 ? <Smile className="h-3 w-3 text-green-500" /> : <Meh className="h-3 w-3 text-yellow-500" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default CustomerProfileCards;
