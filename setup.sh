#!/bin/bash
set -e
echo "🔒 VAPTLearn Setup"
echo "=================="

# Backend
echo "📦 Setting up Backend..."
cd backend
python3 -m venv venv 2>/dev/null || true
./venv/bin/pip install -r requirements.txt -q
echo "  ✅ Backend ready"
cd ..

# Frontend
echo "🎨 Setting up Frontend..."
cd frontend
npm install --silent
echo "  ✅ Frontend ready"
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To run:"
echo "  Terminal 1: cd backend && ./venv/bin/uvicorn main:app --reload --port 8000"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Open: http://localhost:5173"
