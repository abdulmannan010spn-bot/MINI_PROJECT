#!/usr/bin/env bash
echo "=================================================================="
echo "  🚀 Deploying ConnectAI - AI Integrated People Chat Application  "
echo "=================================================================="
echo ""

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed! Please install Node.js 18+."
    exit 1
fi

echo "[*] Starting ConnectAI Production Server..."
node serve.js
