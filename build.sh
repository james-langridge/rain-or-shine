#!/bin/bash
set -e

echo "Starting monorepo build..."

# Build server
echo "Building server..."
cd apps/server
npm run build
cd ../..

# Build client
echo "Building client..."
cd apps/client
npm run build
cd ../..

# Copy client to server public
echo "Copying client files to server..."
mkdir -p apps/server/dist/public
cp -r apps/client/dist/* apps/server/dist/public/

# Verify
echo "Verifying build..."
if [ -f "apps/server/dist/public/index.html" ]; then
    echo "✓ Build successful - index.html found"
    ls -la apps/server/dist/public/
else
    echo "✗ Build failed - index.html not found"
    exit 1
fi