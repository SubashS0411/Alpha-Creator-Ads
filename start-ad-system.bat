@echo off
echo Starting Advertisement System Test...
echo.

echo 🔧 Starting MongoDB...
start /B mongod --dbpath="C:\Users\nares\OneDrive\Desktop\clone\mongodb-data" --noauth

timeout /t 3 > nul

echo 🖥️  Starting Backend Server...
cd /d "C:\Users\nares\OneDrive\Desktop\clone\backend"
start /B npm start

timeout /t 3 > nul

echo 🌐 Starting Frontend Development Server...
cd /d "C:\Users\nares\OneDrive\Desktop\clone\frontend"
start /B npm run dev

echo.
echo ✅ All servers starting...
echo.
echo 📝 Test URLs:
echo    - Main App: http://localhost:3000
echo    - Advertisement Demo: http://localhost:3000/ad-demo
echo    - YouTube: http://localhost:3000/youtube
echo    - Backend API: http://localhost:5000
echo.
echo 🎬 Your WhatsApp videos will appear as ads!
pause