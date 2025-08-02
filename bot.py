"""
SECCO Tap Game Telegram Bot
Hamster Kombat style game for SECCO Network
"""

import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
import json
import os

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Bot configuration
BOT_TOKEN = "8211591463:AAEa_gd1EfTycbLjX3QPIgebCwuMuxCojg8"  # Your SECCO Tap Bot token
# Web App URL
WEB_APP_URL = "https://dmitrycoinsec.github.io/secco-tap-game/"

class SECCOTapBot:
    def __init__(self):
        self.application = Application.builder().token(BOT_TOKEN).build()
        self.setup_handlers()
    
    def setup_handlers(self):
        """Set up command and callback handlers"""
        self.application.add_handler(CommandHandler("start", self.start_command))
        self.application.add_handler(CommandHandler("game", self.game_command))
        self.application.add_handler(CommandHandler("stats", self.stats_command))
        self.application.add_handler(CommandHandler("help", self.help_command))
        self.application.add_handler(CallbackQueryHandler(self.button_callback))
    
    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /start command"""
        user = update.effective_user
        
        welcome_text = f"""
🚀 **Welcome to SECCO Tap Game, {user.first_name}!**

💎 The ultimate DeFi mining simulator!
⚡ Tap to earn SECCO tokens
🔥 Upgrade your mining power
📈 Compete with friends

**BlackRock is the past — CoinSecurities begins a new era of investing!**

Ready to start mining? 👇
        """
        
        keyboard = [
            [InlineKeyboardButton("🎮 Play SECCO Tap Game", web_app=WebAppInfo(url=WEB_APP_URL))],
            [InlineKeyboardButton("📊 My Stats", callback_data="stats")],
            [InlineKeyboardButton("👥 Invite Friends", callback_data="referral")],
            [InlineKeyboardButton("ℹ️ Help", callback_data="help")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            welcome_text,
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
    
    async def game_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /game command"""
        keyboard = [
            [InlineKeyboardButton("🎮 Launch Game", web_app=WebAppInfo(url=WEB_APP_URL))]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            "🎮 **SECCO Tap Game**\n\n"
            "Tap the button below to start mining SECCO tokens!",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
    
    async def stats_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /stats command"""
        user_id = update.effective_user.id
        
        # In a real bot, you'd fetch this from a database
        stats_text = f"""
📊 **Your SECCO Mining Stats**

💰 **Balance:** 1,250 SECCO
🎯 **Total Taps:** 5,420
📈 **Total Earned:** 3,750 SECCO
⚡ **Mining Power:** 15 per tap
🏆 **Level:** 8
👑 **Rank:** Trader

🔥 **Daily Leaderboard:** #127
📅 **Days Active:** 12
        """
        
        keyboard = [
            [InlineKeyboardButton("🎮 Continue Mining", web_app=WebAppInfo(url=WEB_APP_URL))],
            [InlineKeyboardButton("🔄 Refresh Stats", callback_data="stats")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            stats_text,
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /help command"""
        help_text = """
❓ **SECCO Tap Game Help**

**How to Play:**
🎯 Tap the SECCO logo to earn tokens
⚡ Each tap costs 1 energy
🔋 Energy regenerates over time
⬆️ Buy upgrades to earn more per tap

**Upgrades Available:**
💎 **Enhanced Mining** - More tokens per tap
⚡ **Auto Staking** - Passive income per second
🔋 **Energy Boost** - Increase max energy
🚀 **DeFi Multiplier** - 2x earnings temporarily

**Commands:**
/start - Welcome message
/game - Launch the game
/stats - View your statistics
/help - Show this help

**Need Support?**
Contact: @secco_support
        """
        
        keyboard = [
            [InlineKeyboardButton("🎮 Play Now", web_app=WebAppInfo(url=WEB_APP_URL))],
            [InlineKeyboardButton("📱 Join Community", url="https://t.me/secco_community")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            help_text,
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
    
    async def button_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle button callbacks"""
        query = update.callback_query
        await query.answer()
        
        if query.data == "stats":
            await self.stats_command(update, context)
        
        elif query.data == "help":
            await self.help_command(update, context)
        
        elif query.data == "referral":
            user_id = update.effective_user.id
            referral_link = f"https://t.me/secco_tap_bot?start=ref_{user_id}"
            
            referral_text = f"""
👥 **Invite Friends & Earn Bonuses!**

🎁 **Referral Rewards:**
• Friend joins: +100 SECCO for both
• Friend reaches level 5: +500 SECCO bonus
• Friend reaches level 10: +1000 SECCO bonus

📎 **Your Referral Link:**
`{referral_link}`

📊 **Your Referral Stats:**
• Friends invited: 5
• Total bonus earned: 2,300 SECCO
• Active referrals: 3

Share your link and start earning! 🚀
            """
            
            keyboard = [
                [InlineKeyboardButton("📤 Share Link", url=f"https://t.me/share/url?url={referral_link}&text=🎮 Join me in SECCO Tap Game! Earn crypto by tapping! 🚀")],
                [InlineKeyboardButton("🎮 Back to Game", web_app=WebAppInfo(url=WEB_APP_URL))]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(
                referral_text,
                parse_mode='Markdown',
                reply_markup=reply_markup
            )
    
    def run(self):
        """Start the bot"""
        logger.info("Starting SECCO Tap Bot...")
        self.application.run_polling()

if __name__ == "__main__":
    # Create bot instance and run
    bot = SECCOTapBot()
    bot.run()
