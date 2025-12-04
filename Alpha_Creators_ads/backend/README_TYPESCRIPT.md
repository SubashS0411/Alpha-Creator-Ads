# AlphaAds Backend - TypeScript API

## Overview
A fully-typed TypeScript backend for the AlphaAds advertising platform, featuring RESTful APIs for campaign management, ad creation, analytics, and AI-powered ad generation.

## Tech Stack
- **Runtime**: Node.js
- **Language**: TypeScript 5.3+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS
- **Development**: tsx (TypeScript executor)

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── index.ts         # Main configuration with environment variables
│   │   └── database.ts      # MongoDB connection management
│   │
│   ├── models/              # Mongoose models with TypeScript interfaces
│   │   ├── User.ts          # User authentication and profile
│   │   ├── Campaign.ts      # Ad campaigns
│   │   ├── Ad.ts           # Individual advertisements
│   │   └── Analytics.ts    # Performance analytics data
│   │
│   ├── validations/         # Zod validation schemas
│   │   ├── authValidation.ts        # Auth endpoint validations
│   │   ├── campaignValidation.ts   # Campaign endpoint validations
│   │   └── adValidation.ts         # Ad endpoint validations
│   │
│   ├── services/            # Business logic layer
│   │   ├── auth.service.ts        # Authentication services
│   │   ├── campaign.service.ts    # Campaign management
│   │   ├── ad.service.ts          # Ad management
│   │   └── analytics.service.ts   # Analytics calculations
│   │
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── campaign.controller.ts
│   │   ├── ad.controller.ts
│   │   └── analytics.controller.ts
│   │
│   ├── routes/              # Route definitions
│   │   ├── index.ts               # Main router
│   │   ├── auth.routes.ts
│   │   ├── campaign.routes.ts
│   │   ├── ad.routes.ts
│   │   └── analytics.routes.ts
│   │
│   ├── middlewares/         # Custom middleware
│   │   ├── auth.middleware.ts       # JWT authentication
│   │   ├── validation.middleware.ts # Zod validation
│   │   ├── error.middleware.ts      # Error handling
│   │   └── logger.middleware.ts     # Request logging
│   │
│   ├── utils/               # Utility functions
│   │   └── apiResponse.ts         # Standardized API responses
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── express.d.ts           # Express type extensions
│   │
│   ├── app.ts              # Express application setup
│   └── server.ts           # Server entry point
│
├── dist/                   # Compiled JavaScript (generated)
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README_TYPESCRIPT.md    # This file
```

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /verify-email` - Verify email address
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `POST /refresh-token` - Refresh access token
- `GET /me` - Get current user (protected)
- `POST /change-password` - Change password (protected)
- `POST /logout` - User logout (protected)
- `POST /deactivate` - Deactivate account (protected)

### Campaigns (`/api/v1/campaigns`)
All routes require authentication:
- `GET /` - Get all campaigns (with pagination & filters)
- `POST /` - Create new campaign
- `GET /stats` - Get campaign statistics
- `GET /:id` - Get campaign by ID
- `PUT /:id` - Update campaign
- `DELETE /:id` - Delete campaign
- `PATCH /:id/status` - Update campaign status

### Ads (`/api/v1/ads`)
All routes require authentication:
- `GET /` - Get all ads (with pagination & filters)
- `POST /` - Create new ad
- `POST /generate` - Generate AI-powered ad
- `GET /campaign/:campaignId` - Get ads by campaign
- `GET /:id` - Get ad by ID
- `GET /:id/performance` - Get ad performance metrics
- `PUT /:id` - Update ad
- `DELETE /:id` - Delete ad
- `PATCH /:id/status` - Update ad status

### Analytics (`/api/v1/analytics`)
All routes require authentication:
- `GET /overview` - User overview analytics
- `GET /platform-comparison` - Compare platform performance
- `GET /trending` - Get trending metrics
- `GET /campaign/:campaignId` - Campaign analytics
- `GET /ad/:adId` - Ad analytics

## Development

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=8000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/alphaads

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Security
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8083

# OpenAI (optional)
OPENAI_API_KEY=your-openai-key
```

### Scripts

**Development** (with hot reload):
```bash
npm run dev
```

**Build** (compile TypeScript):
```bash
npm run build
```

**Production**:
```bash
npm start
```

**Type Check**:
```bash
npm run type-check
```

**Linting**:
```bash
npm run lint
```

## Type Safety Features

### 1. Model Interfaces
All Mongoose models have corresponding TypeScript interfaces:

```typescript
export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  role: 'user' | 'admin';
  // ... more fields
  comparePassword(password: string): Promise<boolean>;
}
```

### 2. Zod Validation with Type Inference
Validation schemas automatically generate TypeScript types:

```typescript
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username: z.string().min(3).max(30),
    password: z.string().min(8)
  })
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
```

### 3. Express Type Extensions
Custom type definitions extend Express Request:

```typescript
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
```

### 4. Typed Services
All service methods have full type annotations:

```typescript
async createCampaign(userId: string, data: CreateCampaignInput): Promise<ICampaign>
```

## Error Handling

### Custom Error Class
```typescript
class CustomError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

### Global Error Middleware
Catches all errors and sends standardized responses with proper HTTP status codes.

## Authentication Flow

1. User registers → Password hashed → JWT tokens generated
2. User logs in → Credentials verified → Access + Refresh tokens issued
3. Protected routes → Bearer token verified → User attached to request
4. Token refresh → Refresh token verified → New access token issued

## Database Schema Highlights

### User Schema
- Email verification system
- Password reset tokens with expiry
- Account lockout after failed login attempts
- Role-based access control

### Campaign Schema
- Multi-platform support (Facebook, Instagram, Twitter, LinkedIn, TikTok, Google, YouTube)
- Budget tracking (total, daily, spent)
- Targeting options (age, gender, location, interests)
- Scheduling with timezone support
- Real-time metrics (impressions, clicks, conversions, CTR, CPC, CPM, ROAS)

### Ad Schema
- Multiple ad types (image, video, carousel, story, text)
- AI generation tracking
- Performance scoring (0-100)
- Content structure (headline, description, CTA, media URLs)

### Analytics Schema
- Time-series data storage
- Demographics tracking (age groups, gender, locations)
- Device breakdown (desktop, mobile, tablet)
- Hourly and daily metrics

## Best Practices

### 1. Separation of Concerns
- **Routes**: Define endpoints and apply middleware
- **Controllers**: Handle HTTP requests/responses
- **Services**: Implement business logic
- **Models**: Define data structure

### 2. Validation
- All input validated with Zod schemas
- Type-safe validation with automatic type inference
- Detailed error messages for validation failures

### 3. Error Handling
- Try-catch blocks in all async functions
- Errors passed to Express error middleware
- Differentiated between operational and programming errors

### 4. Type Safety
- No `any` types (except for controlled type assertions)
- Strict TypeScript configuration
- Full type coverage across all layers

## Migration from JavaScript

This backend has been completely rewritten in TypeScript from the original JavaScript codebase with the following improvements:

1. **Type Safety**: All functions, variables, and data structures are fully typed
2. **Better Validation**: Replaced Joi with Zod for runtime validation and type inference
3. **Improved Architecture**: Clear separation between controllers, services, and routes
4. **Enhanced Error Handling**: Custom error classes and global error middleware
5. **Modern Patterns**: Async/await throughout, proper promise handling

## Contributing

When adding new features:

1. Create TypeScript interfaces for new data models
2. Add Zod validation schemas for new endpoints
3. Implement service layer methods with full type annotations
4. Create typed controller methods
5. Define routes with proper middleware
6. Update this README with new endpoints

## License

MIT License - See LICENSE file for details
