@echo off
echo Starting YouTube Clone Application with Advertisement System...

REM Start MongoDB (required for advertisements)
echo 🔧 Starting MongoDB for Advertisement System...
start /B "MongoDB" powershell -Command "mongod --dbpath='C:\Users\nares\OneDrive\Desktop\clone\mongodb-data' --noauth"

REM Wait 2 seconds for MongoDB to initialize
timeout /t 2 /nobreak >nul

REM Start backend in new PowerShell window
echo 🖥️ Starting Backend Server with Advertisement API...
start "Backend Server" powershell -Command "cd 'C:\Users\nares\OneDrive\Desktop\clone\backend'; npm start"

REM Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

REM Start frontend in new PowerShell window
echo 🌐 Starting Frontend with YouTube Advertisement Integration...
start "Frontend Dev Server" powershell -Command "cd 'C:\Users\nares\OneDrive\Desktop\clone\frontend'; npm run dev"

echo.
echo ✅ All services are starting...
echo 📱 Mobile App: http://localhost:3000
echo 🎬 YouTube (with Ads): http://localhost:3000/youtube  
echo 📺 Ad Demo: http://localhost:3000/ad-demo
echo 🖥️ Backend API: http://localhost:5000
echo.
echo 🎯 Your WhatsApp videos will now play as advertisements in YouTube!
echo 💡 Click any YouTube video to see your laptop ads before the main content.
pause