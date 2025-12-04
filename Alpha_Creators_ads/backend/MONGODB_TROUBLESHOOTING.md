# 🔍 MongoDB User Registration - Troubleshooting Guide

## ✅ Issue Resolved!

The database connection and user creation are working correctly. Here's how to verify your users are being saved:

## 📊 Quick Check - View All Users

Run this command to see all users in the database:

```bash
cd backend
node view-users.js
```

This will display:
- Total number of users
- Email addresses
- Usernames
- Creation dates
- Email verification status

## 🧪 Test User Creation

To test if registration is working:

```bash
cd backend
node test-database.js
```

This will:
1. Connect to MongoDB
2. Create a test user
3. Verify it's saved in the database
4. List all users

## 📝 What I Found

### ✅ Database is Working
- MongoDB connection: **ACTIVE** ✅
- Database name: `alpha_creator_ads`
- Connection string: `mongodb://localhost:27017/alpha_creator_ads`
- Users are being saved correctly ✅

### 🔧 Improvements Made

1. **Added Logging to Auth Service**
   - Now logs when users register: `✅ User registered: email@example.com`
   - Logs token generation: `🔑 Tokens generated for user: email@example.com`

2. **Added Logging to Controllers**
   - Registration attempts: `📝 Registration attempt: email@example.com`
   - Login attempts: `🔐 Login attempt: email@example.com`
   - Error logging for failed operations

3. **Created Helper Scripts**
   - `view-users.js` - View all users in database
   - `test-database.js` - Test database connection and user creation

## 🎯 How to Verify Your User Registration

### Method 1: Check Server Logs
When you register a user, you should see:
```
📝 Registration attempt: youruser@example.com
✅ User registered: youruser@example.com (ID: 6927...)
🔑 Tokens generated for user: youruser@example.com
```

### Method 2: View Users Script
```bash
node view-users.js
```

Expected output:
```
═══════════════════════════════════════════════════════
📊 Total Users in Database: 2
═══════════════════════════════════════════════════════

1. 📧 youruser@example.com
   👤 Username: yourusername
   🏷️  Name: Your Name
   ✉️  Email Verified: ❌
   📅 Created: 26/11/2025, 9:30:45 pm
   ──────────────────────────────────────────────────

2. 📧 test@example.com
   👤 Username: testuser
   ...
```

### Method 3: MongoDB Compass (GUI)
If you have MongoDB Compass installed:
1. Connect to: `mongodb://localhost:27017`
2. Open database: `alpha_creator_ads`
3. View collection: `users`

### Method 4: MongoDB Shell
```bash
mongosh
use alpha_creator_ads
db.users.find().pretty()
```

## 🚨 Common Issues

### Issue: "No users found"
**Possible Causes:**
1. You're looking at the wrong database
2. Registration failed silently
3. MongoDB wasn't running during registration

**Solution:**
- Check server logs for registration messages
- Run `node view-users.js` to verify
- Try registering again with the server running

### Issue: "Cannot connect to MongoDB"
**Error:** `MongooseServerSelectionError`

**Solution:**
1. Make sure MongoDB is installed
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - Mac/Linux: `brew services start mongodb-community` or `sudo systemctl start mongod`
3. Verify it's running: `mongosh --eval "db.version()"`

### Issue: "User already exists"
**Error:** `Email already registered` or `Username already taken`

**This means the user WAS created!** ✅

**Solution:**
- Run `node view-users.js` to see existing users
- Use a different email/username
- Or delete the existing user first

## 📱 Register a User via API

### Using the Test HTML Page
1. Open: `frontend/api-test.html` in browser
2. Fill in registration form
3. Click "Register"
4. Check the response

### Using curl/PowerShell
```powershell
$body = @{
    email = "newuser@example.com"
    username = "newuser123"
    password = "SecurePass123!"
    firstName = "New"
    lastName = "User"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:8000/api/v1/auth/register `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Using Frontend
```javascript
import AuthService from './services/authService';

const result = await AuthService.register({
  email: 'user@example.com',
  username: 'username123',
  password: 'password123',
  firstName: 'First',
  lastName: 'Last'
});

console.log('User created:', result);
```

## 🎉 Summary

**The system IS working correctly!** Users are being saved to MongoDB. 

To verify your specific user:
1. Run `node view-users.js` to see all users
2. Check server logs during registration
3. The user should appear in the list

If you don't see your user, it likely means:
- Registration failed (check error messages)
- You're looking at a different database
- The server wasn't connected to MongoDB when you registered

**Need more help?** Share:
- The email you tried to register
- Any error messages from the server
- Output from `node view-users.js`
