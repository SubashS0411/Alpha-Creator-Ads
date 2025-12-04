import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, ThumbsUp, Share2, MoreHorizontal, Smile, Frown, Meh } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

interface SocialPost {
    id: string;
    platform: string;
    user: string;
    message: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    timestamp: string;
}

const SocialMediaFeed = () => {
    const [posts, setPosts] = useState<SocialPost[]>([]);

    useEffect(() => {
        // Connect to socket
        const socket = io('http://localhost:8000');

        socket.on('new_social_post', (post: SocialPost) => {
            setPosts(prev => [post, ...prev].slice(0, 20)); // Keep last 20 posts
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const getSentimentIcon = (sentiment: string) => {
        switch (sentiment) {
            case 'positive': return <Smile className="h-4 w-4 text-green-500" />;
            case 'negative': return <Frown className="h-4 w-4 text-red-500" />;
            default: return <Meh className="h-4 w-4 text-yellow-500" />;
        }
    };

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case 'positive': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'negative': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        }
    };

    return (
        <Card className="h-full bg-card/50 backdrop-blur-xl border-border overflow-hidden flex flex-col lightning-card shadow-sm">
            <CardHeader className="pb-2 border-b border-border">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Social Media Feed</CardTitle>
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4">
                    <AnimatePresence initial={false}>
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mb-4"
                            >
                                <div className={`p-4 rounded-xl border ${getSentimentColor(post.sentiment)} relative overflow-hidden group hover:bg-white/5 transition-colors`}>
                                    <div className="flex items-start gap-3">
                                        <Avatar className="h-8 w-8 border border-white/10">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user}`} />
                                            <AvatarFallback>{post.user[1]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-sm truncate">{post.user}</span>
                                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${getSentimentColor(post.sentiment)}`}>
                                                    {post.sentiment}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-foreground/90 leading-relaxed mb-2">{post.message}</p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                                                    <MessageSquare className="h-3 w-3" /> 12
                                                </span>
                                                <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                                                    <Share2 className="h-3 w-3" /> 5
                                                </span>
                                                <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                                                    <ThumbsUp className="h-3 w-3" /> 24
                                                </span>
                                                <span className="ml-auto opacity-50">{new Date(post.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {posts.length === 0 && (
                            <div className="text-center text-muted-foreground py-10">
                                Waiting for live updates...
                            </div>
                        )}
                    </AnimatePresence>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default SocialMediaFeed;
