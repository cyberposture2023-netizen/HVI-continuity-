@echo off
echo HVI Continuity Platform - Windows Service Manager
echo ===============================================

:menu
echo.
echo 1. Start Backend Server
echo 2. Stop Backend Server
echo 3. Check Status
echo 4. Exit
echo.
set /p choice="Enter choice [1-4]: "

if "%choice%"=="1" goto start-backend
if "%choice%"=="2" goto stop-backend
if "%choice%"=="3" goto status
if "%choice%"=="4" goto exit

echo Invalid choice. Please try again.
goto menu

:start-backend
echo Starting HVI Backend Server...
start "HVI Backend" /B node backend\server.js
echo Backend started on http://localhost:5000
echo Use Option 3 to check status
goto menu

:stop-backend
echo Stopping HVI Platform...
taskkill /F /IM node.exe 2>nul
echo Platform stopped.
goto menu

:status
echo Service Status:
echo.
echo Node processes:
tasklist | findstr node || echo No Node processes running
goto menu

:exit
echo Goodbye!
pause
