@echo off
echo Starting HVI Continuity Platform...
echo.

echo Step 1: Checking MongoDB...
netstat -an | find ":27017" >nul
if errorlevel 1 (
    echo ❌ MongoDB not running on port 27017
    echo Please start MongoDB first
    pause
    exit /b 1
) else (
    echo ✅ MongoDB is running
)

echo.
echo Step 2: Starting Backend Server...
cd backend
start "HVI Backend" cmd /k "npm start"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Step 3: Starting Frontend Development Server...
cd ..\frontend
start "HVI Frontend" cmd /k "npm start"

echo.
echo ✅ Both servers are starting...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo Dashboard: http://localhost:3000/dashboard
echo Assessment: http://localhost:3000/assessment
echo.
echo Press any key to run health check...
pause >nul

echo.
echo Running health check...
cd ..\backend
node health-check.js

echo.
echo Setup complete! Check the opened terminal windows for server logs.
pause
