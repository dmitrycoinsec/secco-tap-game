#!/bin/bash

# Script to create GitHub repo, push all files, set secrets, and trigger deployment for SECCO Tap Game

REPO_NAME="secco-tap-game"
GITHUB_USER="dmitrycoinsec"
BOT_TOKEN="8399679674:AAHkrws-Td0oqnmbSWB8FeS9PgEkN7tm924"
WEB_APP_URL="https://dmitrycoinsec.github.io/secco-tap-game/"

echo "Creating GitHub repository: $REPO_NAME"
gh repo create $GITHUB_USER/$REPO_NAME --public --confirm

echo "Initializing git repository locally (if not already)"
git init

echo "Adding all files to git"
git add .

echo "Committing files"
git commit -m "Initial commit for SECCO Tap Game deployment"

echo "Setting remote origin"
git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git

echo "Pushing to GitHub main branch"
git branch -M main
git push -u origin main

echo "Setting GitHub Secrets for BOT_TOKEN and WEB_APP_URL"
gh secret set BOT_TOKEN --body "$BOT_TOKEN" --repo $GITHUB_USER/$REPO_NAME
gh secret set WEB_APP_URL --body "$WEB_APP_URL" --repo $GITHUB_USER/$REPO_NAME

echo "Deployment triggered via GitHub Actions on push to main branch."
echo "Check GitHub Actions tab for build and deployment status."

echo "Deployment script completed."
