#!/bin/bash

# Script to set up GitHub repository for ÖBB Train Checker

echo "🚂 ÖBB Train Checker - GitHub Setup"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your repository name [oebb-train-checker]: " REPO_NAME
REPO_NAME=${REPO_NAME:-oebb-train-checker}

echo ""
echo "Updating files with your GitHub information..."

# Update repository.json
sed -i '' "s|https://github.com/yourusername/oebb-train-checker|https://github.com/${GITHUB_USERNAME}/${REPO_NAME}|g" repository.json
sed -i '' "s|Your Name <your.email@example.com>|${GITHUB_USERNAME}|g" repository.json

# Update addon/config.json
sed -i '' "s|https://github.com/yourusername/oebb-train-checker|https://github.com/${GITHUB_USERNAME}/${REPO_NAME}|g" addon/config.json
sed -i '' "s|ghcr.io/yourusername/oebb-train-checker|ghcr.io/${GITHUB_USERNAME}/${REPO_NAME}|g" addon/config.json

echo "✅ Files updated!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub: https://github.com/new"
echo "   Repository name: ${REPO_NAME}"
echo "   Description: Home Assistant add-on for monitoring ÖBB train schedules"
echo "   Do NOT initialize with README, .gitignore, or license"
echo ""
echo "2. Then run these commands:"
echo "   git remote add origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. After pushing, enable GitHub Actions:"
echo "   Go to: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings/actions"
echo "   Enable: 'Allow all actions and reusable workflows'"

