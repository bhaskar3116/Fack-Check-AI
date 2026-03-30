@echo off
echo ========================================
echo   Starting Fact Check AI
echo ========================================

:: Start Backend
echo [1/2] Starting Backend...
start "Fact-Check Backend" cmd /k "cd /d %~dp0fact-checker\backend && call venv\Scripts\activate && uvicorn main:app --reload --port 8000"

:: Wait a moment before starting frontend
timeout /t 3 /nobreak >nul

:: Start Frontend
echo [2/2] Starting Frontend...
start "Fact-Check Frontend" cmd /k "cd /d %~dp0fact-checker\frontend && npm run dev"

echo.
echo ========================================
echo   Backend  -> http://localhost:8000
echo   Frontend -> http://localhost:5173
echo ========================================
echo   Run stop.bat to shut everything down
echo ========================================
