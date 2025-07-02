#!/bin/bash

echo "🔄 Stopping running Next.js processes..."
pkill -f "next"

echo "🧹 Cleaning Next.js cache..."
rm -rf .next

echo "🧩 Clearing node_modules/.cache..."
rm -rf node_modules/.cache

echo "🔄 Reinstalling dependencies..."
npm install

echo "🚀 Starting the application..."
npm run dev
