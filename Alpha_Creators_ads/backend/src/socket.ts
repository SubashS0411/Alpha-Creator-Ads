import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import config from './config/index.js';

let io: SocketIOServer;

export const initializeSocket = (httpServer: HttpServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: config.cors.origins,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`🔌 Client connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    // Start mock data simulation
    startMockDataSimulation();

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

// Mock Data Simulation
const startMockDataSimulation = () => {
    // Simulate Sentiment Updates (every 5 seconds)
    setInterval(() => {
        if (io) {
            const sentimentData = {
                joy: Math.floor(Math.random() * 30) + 60, // 60-90%
                frustration: Math.floor(Math.random() * 15) + 5, // 5-20%
                excitement: Math.floor(Math.random() * 20) + 10, // 10-30%
                timestamp: new Date().toISOString(),
            };
            io.emit('sentiment_update', sentimentData);
        }
    }, 5000);

    // Simulate New Social Media Posts (every 8-15 seconds)
    setInterval(() => {
        if (io) {
            const platforms = ['Twitter', 'Facebook', 'Instagram', 'LinkedIn'];
            const sentiments = ['positive', 'negative', 'neutral'];
            const users = ['@Alex_M', '@Sarah_J', '@TechGuru', '@MarketingPro', '@CryptoKing'];
            const messages = [
                'Loving the new update! #AlphaAds',
                'Support is a bit slow today...',
                'Just launched my first campaign! 🚀',
                'ROI is looking good this month.',
                'Anyone else seeing this bug?',
                'The analytics dashboard is fire 🔥',
            ];

            const post = {
                id: Date.now().toString(),
                platform: platforms[Math.floor(Math.random() * platforms.length)],
                user: users[Math.floor(Math.random() * users.length)],
                message: messages[Math.floor(Math.random() * messages.length)],
                sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
                timestamp: new Date().toISOString(),
            };

            io.emit('new_social_post', post);
        }
    }, Math.random() * 7000 + 8000);

    // Simulate Campaign Status Updates (every 10 seconds)
    setInterval(() => {
        if (io) {
            const campaigns = [
                { name: 'Summer Sale', status: 'Active', progress: Math.floor(Math.random() * 100) },
                { name: 'Q4 Launch', status: 'Pending', progress: Math.floor(Math.random() * 40) },
                { name: 'Black Friday', status: 'Draft', progress: 0 },
            ];
            io.emit('campaign_update', campaigns);
        }
    }, 10000);
};
