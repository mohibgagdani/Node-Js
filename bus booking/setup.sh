#!/bin/bash

echo "🚀 Setting up Bus Booking Application..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   Run: brew services start mongodb/brew/mongodb-community"
    exit 1
fi

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🌱 Seeding sample data..."
node seedData.js

echo "🚀 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🎨 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo "✅ Setup complete!"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:8080"
echo "👤 Admin Login: admin@gmail.com / admin@12345"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID