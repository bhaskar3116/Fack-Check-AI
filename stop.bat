@echo off
echo ========================================
echo   Stopping Fact Check AI
echo ========================================

:: Kill uvicorn (backend)
echo Stopping Backend (uvicorn)...
taskkill /FI "WINDOWTITLE eq Fact-Check Backend" /T /F >nul 2>&1
taskkill /F /IM uvicorn.exe >nul 2>&1

:: Kill node (frontend)
echo Stopping Frontend (node/vite)...
taskkill /FI "WINDOWTITLE eq Fact-Check Frontend" /T /F >nul 2>&1

:: Kill any remaining node on port 5173
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173"') do taskkill /F /PID %%a >nul 2>&1

:: Kill any remaining python on port 8000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000"') do taskkill /F /PID %%a >nul 2>&1

echo.
echo ========================================
echo   All services stopped.
echo ========================================
pause
