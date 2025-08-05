# 🚀 SECCO Tap Game - Deployment Guide

## 📋 Overview

This guide covers the complete deployment process for SECCO Tap Game, including frontend (GitHub Pages) and backend (Telegram Bot) deployment.

## �️ Repository Structure

```
secco-tap-game/
├── Frontend (GitHub Pages)
│   ├── index.html                    # Main game app
│   ├── index_new.html               # Enhanced version
│   ├── index_enhanced.html          # Alternative version
│   ├── manifest.json                # PWA manifest
│   └── tonconnect-manifest.json     # TON Connect config
├── Backend (Telegram Bot)
│   ├── bot.py                       # Main bot code
│   ├── requirements.txt             # Python dependencies
│   └── .env.example                 # Environment template
├── Documentation
│   ├── README.md                    # Main documentation
│   ├── TECHNICAL_DOCS.md            # Technical architecture
│   ├── TELEGRAM_WALLET_SETUP.md     # Wallet integration
│   └── README-deploy.md             # This file
├── Configuration
│   ├── .github/workflows/deploy.yml # CI/CD pipeline
│   ├── .gitignore                   # Git ignore rules
│   └── .env.example                 # Environment variables
└── Assets (if any)
    ├── icons/
    ├── sounds/
    └── images/
```

## 🌐 Frontend Deployment (GitHub Pages)

### 1. Prepare Repository

```bash
# Clone repository
git clone https://github.com/dmitrycoinsec/secco-tap-game.git
cd secco-tap-game

# Ensure all files are present
git add .
git commit -m "📦 Prepare for deployment"
git push origin main
```

### 2. Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Set **Source** to "Deploy from a branch"
3. Select **Branch**: `main`
4. Select **Folder**: `/ (root)`
5. Click **Save**

### 3. Configure Custom Domain (Optional)

```bash
# Add CNAME file for custom domain
echo "game.secco.network" > CNAME
git add CNAME
git commit -m "� Add custom domain"
git push origin main
```

### 4. Verify Deployment

- **GitHub Pages URL**: https://dmitrycoinsec.github.io/secco-tap-game/
- **Custom Domain**: https://game.secco.network (if configured)
- **Manifest URL**: https://dmitrycoinsec.github.io/secco-tap-game/tonconnect-manifest.json

## 🤖 Backend Deployment (Telegram Bot)

### 1. Environment Setup

```bash
# Create environment file
cp .env.example .env

# Edit .env with your values
# BOT_TOKEN=8399679674:AAEDKSBZfwDb0kdXu2eER4lwG5z04DR77hY
# WEB_APP_URL=https://dmitrycoinsec.github.io/secco-tap-game/
```

### 2. Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run bot locally
python bot.py
```

### 3. Production Deployment Options

#### Option A: Heroku

```bash
# Install Heroku CLI and login
heroku login

# Create Heroku app
heroku create secco-tap-bot

# Set environment variables
heroku config:set BOT_TOKEN=your_bot_token_here
heroku config:set WEB_APP_URL=https://dmitrycoinsec.github.io/secco-tap-game/

# Deploy
git push heroku main
```

#### Option B: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option C: VPS/Cloud Server

```bash
# Upload files to server
scp -r . user@your-server:/path/to/bot/

# SSH into server
ssh user@your-server

# Setup and run
cd /path/to/bot/
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create systemd service (Linux)
sudo nano /etc/systemd/system/secco-bot.service
```

**systemd service file:**
```ini
[Unit]
Description=SECCO Tap Game Bot
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/bot
Environment=BOT_TOKEN=your_token_here
Environment=WEB_APP_URL=https://dmitrycoinsec.github.io/secco-tap-game/
ExecStart=/path/to/bot/venv/bin/python bot.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable secco-bot
sudo systemctl start secco-bot
sudo systemctl status secco-bot
```

## 🔧 CI/CD Pipeline (GitHub Actions)

The deployment pipeline automatically:

1. **Triggers** on push to `main` branch
2. **Tests** the frontend
3. **Deploys** to GitHub Pages
4. **Validates** all links and manifests

### Workflow File (`.github/workflows/deploy.yml`)

```yaml
name: Deploy SECCO Tap Game

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 🔐 Security Configuration

### 1. Environment Variables

**Never commit sensitive data:**
- Bot tokens
- API keys
- Database credentials
- Secret keys

### 2. Domain Verification

Verify your domains in:
- GitHub Pages settings
- TON Connect manifest
- Telegram Bot settings

### 3. HTTPS Enforcement

Ensure HTTPS is enabled:
- GitHub Pages (automatic)
- Custom domains (configure SSL)
- Bot webhooks (HTTPS required)

## 📊 Monitoring & Analytics

### 1. GitHub Pages Analytics

- Monitor deployment status
- Check access logs
- Track performance metrics

### 2. Bot Monitoring

```python
# Add to bot.py for monitoring
import logging

# Enhanced logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('bot.log'),
        logging.StreamHandler()
    ]
)
```

### 3. Error Tracking

Consider integrating:
- Sentry for error tracking
- Google Analytics for web analytics
- Custom metrics for game analytics

## 🧪 Testing

### 1. Frontend Testing

```bash
# Test locally
python -m http.server 8000
# Visit http://localhost:8000

# Test TON Connect
# Verify manifest accessibility
curl https://dmitrycoinsec.github.io/secco-tap-game/tonconnect-manifest.json
```

### 2. Bot Testing

```bash
# Test bot commands
python bot.py

# In Telegram:
# /start - Test welcome message
# /game - Test web app launch
# /help - Test help command
```

### 3. Integration Testing

1. **Wallet Connection** - Test TON Connect
2. **Game Mechanics** - Verify tap functionality
3. **Energy System** - Check 12-hour refill
4. **Upgrades** - Test purchase system
5. **Statistics** - Verify data persistence

## 🚀 Go Live Checklist

### Pre-Launch

- [ ] All environment variables set
- [ ] Bot token configured and active
- [ ] GitHub Pages deployed successfully
- [ ] TON Connect manifest accessible
- [ ] All links working correctly
- [ ] Security settings configured
- [ ] Monitoring enabled

### Launch

- [ ] Deploy bot to production
- [ ] Test all functionality end-to-end
- [ ] Monitor for errors
- [ ] Verify analytics tracking
- [ ] Test from multiple devices

### Post-Launch

- [ ] Monitor user engagement
- [ ] Track error rates
- [ ] Optimize performance
- [ ] Plan feature updates
- [ ] Scale infrastructure as needed

## 📞 Support & Maintenance

### Regular Tasks

1. **Update dependencies** monthly
2. **Monitor bot logs** daily
3. **Check GitHub Pages** status
4. **Review analytics** weekly
5. **Backup user data** regularly

### Troubleshooting

**Common Issues:**

1. **Bot not responding**
   - Check token validity
   - Verify webhook status
   - Review error logs

2. **Game not loading**
   - Check GitHub Pages status
   - Verify manifest URLs
   - Test from different browsers

3. **Wallet connection fails**
   - Validate TON Connect manifest
   - Check HTTPS enforcement
   - Verify domain configuration

### Getting Help

- 📧 **Email**: support@secco.network
- 💬 **Telegram**: @secco_support
- 📖 **Documentation**: Full technical docs available
- 🐛 **Issues**: GitHub Issues for bug reports

---

## 🎯 Success Metrics

Track these KPIs post-deployment:

- **Daily Active Users (DAU)**
- **Session Duration**
- **Tap Engagement Rate**
- **Wallet Connection Rate**
- **Error Rate < 1%**
- **Page Load Time < 2s**

**BlackRock is the past — CoinSecurities begins a new era!** 🚀

---

*Last updated: August 2025*
