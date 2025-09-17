#!/bin/bash
# Development reset script to avoid common bugs

echo "🧹 Cleaning development environment..."

# Clear Metro cache
echo "📦 Clearing Metro cache..."
npx expo start --clear

# Alternative: Full reset
# echo "🔄 Full reset..."
# rm -rf node_modules
# npm install
# npx expo start --clear
