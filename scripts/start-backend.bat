@echo off
title HVI-Continuity Backend
echo ========================================
echo    HVI-Continuity Backend Server
echo ========================================
echo.
echo Stopping any existing backend processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul
echo.
echo Starting backend server...
cd /d D:\HVI-Continuity\hvi-continuity-platform\backend
npm run dev
echo.
echo Backend server stopped.
pause
