@echo off
chcp 65001 >nul
title HVI-Continuity Backend Server

echo ========================================
echo    HVI-Continuity Platform - Backend
echo ========================================
echo.

echo Stopping any existing Node processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

echo Checking port 5000...
netstat -ano | findstr ":5000" >nul
if %errorlevel% == 0 (
    echo Port 5000 is in use. Server will use next available port.
)

echo.
echo Starting backend server...
echo.
cd /d D:\HVI-Continuity\hvi-continuity-platform\backend
node src/server.js

echo.
echo Server has stopped.
echo Press any key to close...
pause >nul
