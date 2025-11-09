@echo off
title HVI-Continuity Development Launcher
echo ========================================
echo  HVI-Continuity Development Environment
echo ========================================
echo.
echo Stopping any existing Node processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 >nul
echo.
echo Starting Backend Server...
start "HVI Backend" cmd /k "cd /d D:\HVI-Continuity\hvi-continuity-platform\backend && npm run dev"
echo Backend server starting... (waiting 10 seconds)
timeout /t 10 >nul
echo.
echo Starting Frontend Server...
start "HVI Frontend" cmd /k "cd /d D:\HVI-Continuity\hvi-continuity-platform\frontend && npm start"
echo.
echo ========================================
echo  Development servers are starting...
echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo.
echo  Check the opened command windows for progress.
echo ========================================
echo.
pause
