# Alpha Creator Ads - Node.js Backend

## 🚀 Overview

Complete Node.js/Express backend for the Alpha Creator Ads platform with authentication, MongoDB integration, and RESTful API.

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local or Atlas)

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/alpha_creator_ads
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

See `.env.example` for all available options.

## 🚀 Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start

# Run tests
npm test
```

Server will start at: `http://localhost:8000`

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}
```

#### Get Current User
```http 
GET /api/v1/auth/me
Authorization: Bearer <access_token>KO
```

#### Change Password
```http
POST /api/v1/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

#### Request Password Reset
```http
POST /api/v1/auth/password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Confirm Password Reset
```http
POST /api/v1/auth/password-reset/confirm
Content-Type: application/json

{
  "token": "reset-token-here",
  "newPassword": "newpass123"
}
```

#### Verify Email
```http
POST /api/v1/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-here"
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token-here"
}
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

#### Deactivate Account
```http
DELETE /api/v1/auth/account
Authorization: Bearer <access_token>
```

## 🏗️ Project Structure

backend/
├── src/
│   ├── config/                 # Configuration & Env variables
│   │   ├── index.ts            # (was config.py)
│   │   └── database.ts         # MongoDB connection (was database.py)
│   │
│   ├── models/                 # Mongoose Schemas (was models/)
│   │   ├── User.ts
│   │   ├── Campaign.ts
│   │   ├── Ad.ts
│   │   └── Analytics.ts
│   │
│   ├── validations/            # Zod/Joi schemas (was schemas/)
│   │   ├── authValidation.ts
│   │   ├── campaignValidation.ts
│   │   └── adValidation.ts
│   │
│   ├── services/               # Business Logic (was services/)
│   │   ├── auth.service.ts
│   │   ├── ai.service.ts
│   │   ├── campaign.service.ts
│   │   ├── analytics.service.ts
│   │   └── optimization.service.ts
│   │
│   ├── controllers/            # Request Handlers (New: splits logic from routes)
│   │   ├── auth.controller.ts
│   │   ├── campaign.controller.ts
│   │   ├── ad.controller.ts
│   │   ├── analytics.controller.ts
│   │   └── ai.controller.ts
│   │
│   ├── routes/                 # Route Definitions (was api/)
│   │   ├── index.ts            # Main router hub
│   │   ├── auth.routes.ts
│   │   ├── campaign.routes.ts
│   │   ├── ad.routes.ts
│   │   └── analytics.routes.ts
│   │
│   ├── middlewares/            # Custom Middleware (was middleware/)
│   │   ├── auth.middleware.ts  # (was dependencies.py/get_current_user)
│   │   ├── error.middleware.ts # Global error handler
│   │   ├── rateLimiter.ts
│   │   └── logger.ts
│   │
│   ├── utils/                  # Utility functions
│   │   ├── jwt.ts              # (was security.py)
│   │   ├── hashing.ts          # (was security.py)
│   │   └── apiResponse.ts      # Standardize JSON responses
│   │
│   ├── types/                  # TypeScript Type Definitions
│   │   └── express.d.ts        # Extending Express Request types
│   │
│   ├── app.ts                  # App setup (middleware, routes)
│   └── server.ts               # Entry point (Port listening)
│
├── tests/                      # Jest/Supertest tests
├── .env                        # Environment variables
├── .gitignore
├── package.json                # Dependencies (was requirements.txt)
├── tsconfig.json               # TypeScript config
└── Dockerfile

## 🔐 Security Features

- JWT authentication (access & refresh tokens)
- Bcrypt password hashing
- Account lockout after failed login attempts
- Email verification
- Password reset functionality
- Rate limiting
- Helmet.js security headers
- CORS protection

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": {...},
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## 🛡️ Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📝 License

MIT License
