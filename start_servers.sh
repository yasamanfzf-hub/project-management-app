#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting Backend Server ---"
cd backend
npm install
node index.js > ../backend.log 2>&1 &
echo "Backend server process started."

# Go back to the root directory
cd ..

echo "--- Starting Frontend Server ---"
cd frontend
# The 'BROWSER=none' part prevents the app from trying to open a browser tab
BROWSER=none npm start > ../frontend.log 2>&1 &
echo "Frontend server process started."

echo "--- Both servers are starting in the background. ---"
# Wait a few seconds to let servers initialize
sleep 10
echo "--- Checking logs ---"
echo "Backend Log:"
cat ../backend.log
echo ""
echo "Frontend Log:"
cat ../frontend.log