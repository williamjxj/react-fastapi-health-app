#!/bin/bash
# Start FastAPI backend server on port 8000

cd "$(dirname "$0")"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Use PORT from .env or default to 8000
PORT=${PORT:-8000}

echo "Starting FastAPI backend on port $PORT..."
echo "API will be available at: http://localhost:$PORT"
echo "API docs: http://localhost:$PORT/docs"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port $PORT

