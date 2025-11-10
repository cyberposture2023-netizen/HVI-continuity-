@echo off
echo Starting HVI Continuity Platform Development Environment...
echo.

echo Starting MongoDB...
start "" mongod --dbpath C:\data\db

timeout /t 3 /nobreak > nul

echo Starting Backend Server...
cd /d D:\HVI-Continuity\hvi-continuity-platform\backend
start "HVI Backend" node server.js

timeout /t 5 /nobreak > nul

echo Starting Frontend Development Server...
cd /d D:\HVI-Continuity\hvi-continuity-platform\frontend
start "HVI Frontend" npm start

echo.
echo Development environment started!
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo - API Health: http://localhost:5000/api/health
echo.
pause
