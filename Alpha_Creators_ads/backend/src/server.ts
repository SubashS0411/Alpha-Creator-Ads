/**
 * Server Entry Point
 */

import { createServer } from 'http';
import app from './app.js';
import config from './config/index.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { initializeSocket } from './socket.js';

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();
    console.log('✅ Database connected successfully');

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.io
    const io = initializeSocket(httpServer);
    console.log('✅ Socket.io initialized');

    // Start listening
    const server = httpServer.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 AlphaAds API Server                                   ║
║                                                            ║
║   Environment: ${config.env.padEnd(44)} ║
║   Port:        ${String(config.port).padEnd(44)} ║
║   API URL:     http://localhost:${config.port}/api/v1${' '.repeat(19)} ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('✅ HTTP server closed');

        try {
          await disconnectDatabase();
          console.log('✅ Database connection closed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
