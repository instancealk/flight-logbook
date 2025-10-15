#!/bin/bash

echo "Starting Flight Logbook Application..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "Docker is running"
echo ""

# Stop any existing containers
echo "Cleaning up existing containers..."
docker-compose down -v 2>/dev/null || true

# Build and start services
echo "Building and starting services (this may take a few minutes)..."
docker-compose up --build -d

echo ""
echo "Waiting for services to be ready..."

# Wait for backend to be healthy
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        echo "Backend is ready!"
        break
    fi
    attempt=$((attempt + 1))
    echo "   Waiting for backend... ($attempt/$max_attempts)"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "Backend failed to start. Check logs with: docker-compose logs backend"
    exit 1
fi

# Seed sample data
echo ""
echo "Seeding sample data..."
sleep 2
curl -X POST http://localhost:3000/api/dev/seed 2>/dev/null || echo "   Seeding skipped (endpoint may not be available)"

echo ""
echo "All done! Application is ready."
echo ""
echo "Open the browser and visit:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:3000/api"
echo ""
echo "To view logs:"
echo "   All services: docker-compose logs -f"
echo "   Backend only: docker-compose logs -f backend"
echo "   Frontend only: docker-compose logs -f frontend"
echo ""
echo "To stop the application:"
echo "   docker-compose down"
echo ""
