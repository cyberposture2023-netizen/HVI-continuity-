@echo off
chcp 65001 >nul
title HVI-Continuity Development Environment

echo ========================================
echo    HVI-Continuity Development Launcher
echo ========================================
echo.

echo Stopping existing processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 >nul

echo Starting Backend Server...
start "HVI Backend" cmd /k "cd /d D:\HVI-Continuity\hvi-continuity-platform\backend && node src/server.js"

echo Waiting for backend to initialize...
timeout /t 8 >nul

echo Starting Frontend Server...
start "HVI Frontend" cmd /k "cd /d D:\HVI-Continuity\hvi-continuity-platform\frontend && npm start"

echo.
echo ========================================
echo  Development Environment Starting...
echo.
echo  Backend API:  http://localhost:5000
echo  Frontend App: http://localhost:3000
echo.
echo  Check the opened windows for status.
echo ========================================
echo.
echo Press any key to close this launcher...
pause >nul
