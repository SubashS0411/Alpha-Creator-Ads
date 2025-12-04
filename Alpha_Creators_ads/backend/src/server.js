/**
 * Alpha Creator Ads - Main Server
 * Node.js/Express Backend API
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/database.js';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

/**
 * Security Middleware
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

/**
 * CORS Configuration
 */
app.use(cors({
  origin: config.cors.origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * Rate Limiting
 */
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

/**
 * Body Parsing Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Compression Middleware
 */
app.use(compression());

/**
 * Logging Middleware
 */
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  });
});

/**
 * Root Endpoint
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Alpha Creator Ads API',
    version: '1.0.0',
    description: 'Next-Generation AI-Powered Advertising Platform',
    documentation: '/api/v1/status',
    features: [
      'AI-Powered Ad Generation',
      'Multi-Platform Campaign Management',
      'Real-time Analytics',
      'Advanced Targeting',
      'Budget Optimization',
    ],
  });
});

/**
 * API Routes
 */
app.use('/api/v1', routes);

/**
 * 404 Handler
 */
app.use(notFound);

/**
 * Error Handler
 */
app.use(errorHandler);

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════════════════');
      console.log('🚀 Alpha Creator Ads Backend Server');
      console.log('═══════════════════════════════════════════════════════');
      console.log(`📍 Server running on: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${config.env}`);
      console.log(`📊 API Status: http://localhost:${PORT}/api/v1/status`);
      console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
      console.log('═══════════════════════════════════════════════════════');
      console.log('');
      console.log('✅ Server is ready to accept connections');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('🔥 Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
  process.exit(1);
});

export default app;
