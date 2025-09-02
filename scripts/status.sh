#!/bin/bash

# Yellorn Local Status Check Script
echo "🌍 Yellorn Local Environment Status Check"
echo "=========================================="

# Check Frontend
echo -n "Frontend (Port 3002): "
if curl -s http://localhost:3002 > /dev/null 2>&1; then
    echo "✅ Running"
else
    echo "❌ Not Running"
fi

# Check Backend API
echo -n "Backend API (Port 8000): "
if curl -s http://localhost:8000/api/v1/health/ > /dev/null 2>&1; then
    echo "✅ Running"
else
    echo "❌ Not Running"
fi

# Check Backend Universe Endpoint
echo -n "Universe Data: "
if curl -s http://localhost:8000/api/v1/universe/ > /dev/null 2>&1; then
    echo "✅ Available"
else
    echo "❌ Not Available"
fi

# Check Plots Data
echo -n "AI Agents (Plots): "
PLOTS_COUNT=$(curl -s http://localhost:8000/api/v1/plots/ | jq '. | length' 2>/dev/null)
if [ "$PLOTS_COUNT" != "" ] && [ "$PLOTS_COUNT" -gt 0 ]; then
    echo "✅ $PLOTS_COUNT agents found"
else
    echo "❌ No agents found"
fi

echo ""
echo "🚀 Quick Access:"
echo "   Frontend: http://localhost:3002"
echo "   Backend API: http://localhost:8000/api/v1"
echo "   API Docs: http://localhost:8000/docs"
echo ""

# Show running processes
echo "🔧 Running Processes:"
echo "Frontend:"
ps aux | grep -E "vite|node.*3002" | grep -v grep | head -2
echo "Backend:"
ps aux | grep -E "uvicorn|python.*8000" | grep -v grep | head -2
