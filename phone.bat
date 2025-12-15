@echo off
echo Starting YouTube Clone Application...

REM Start backend in new PowerShell window
start "Backend Server" powershell -Command "cd 'S:\Program File\AlphaAds\backend'; npm start"

REM Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

REM Start frontend in new PowerShell window
start "Frontend Dev Server" powershell -Command "cd 'S:\Program File\AlphaAds\frontend'; npm run dev"

echo Both servers are starting in separate windows...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
pause