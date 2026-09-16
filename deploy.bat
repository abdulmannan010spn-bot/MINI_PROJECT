@echo off
title ConnectAI - Deployment Runner
echo ==================================================================
echo   🚀 Deploying ConnectAI - AI Integrated People Chat Application
echo ==================================================================
echo.

echo [1/3] Checking environment...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed! Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [2/3] Preparing production runtime...
echo.
echo [3/3] Starting ConnectAI Production Server...
node serve.js

pause
