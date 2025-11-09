@echo off
echo Starting HVI-Continuity Platform Development Environment...
echo.
echo Starting Backend Server...
start \"HVI Backend\" cmd /k \"cd /d D:\HVI-Continuity\hvi-continuity-platform\backend && npm run dev\"
timeout /t 5
echo.
echo Starting Frontend Server...
start \"HVI Frontend\" cmd /k \"cd /d D:\HVI-Continuity\hvi-continuity-platform\frontend && npm start\"
echo.
echo Both servers are starting... Check the opened command windows for progress.
pause
