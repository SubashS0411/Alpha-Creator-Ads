# Backend Server Setup

## IMPORTANT: Start the Backend Server

The frontend is trying to connect to the backend server on port 5000, but it's not running.

### To Start the Backend:

1. Open a new terminal/PowerShell window
2. Navigate to the backend directory:
   ```powershell
   cd "C:\Users\nares\OneDrive\Desktop\clone\backend"
   ```
3. Start the server:
   ```powershell
   node server.js
   ```

You should see:
```
Server running on port 5000
Connected to MongoDB - clone database
YouTube upload endpoint: http://localhost:5000/api/youtube/videos/upload
Instagram upload endpoint: http://localhost:5000/api/media/upload
```

### Keep the Backend Running
- Do NOT close this terminal window
- The backend must be running while you use the app
- If you see "ERR_CONNECTION_REFUSED", it means the backend is not running

---

## All Issues Fixed:

✅ **Camera Module**: Now visible on all pages including landing page
✅ **Instagram Upload Text Color**: Changed to white for visibility
✅ **YouTube Upload Modal**: Positioned within mobile frame
✅ **Category Validation**: Fixed to use valid enum values
✅ **Upload Endpoints**: Configured correctly on port 5000

**Next Step**: Start the backend server using the commands above!
