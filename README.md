# 🎮 SECCO Tap Game - Telegram Mini App

**Крипто тапалка с покупкой энергии за TON**

[![Deploy](https://github.com/YOUR_USERNAME/secco-tap-game/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/secco-tap-game/actions/workflows/deploy.yml)

## 🚀 Демо

🔗 **[Играть в игру](https://YOUR_USERNAME.github.io/secco-tap-game/)**

🤖 **[Telegram Mini App](https://t.me/YOUR_BOT_USERNAME)**

## ⭐ Особенности

- 🎮 **Tap-to-Earn механика** с системой уровней
- ⚡ **Система энергии** с 12-часовым восстановлением  
- 💎 **TON блокчейн интеграция** для покупки энергии
- 📱 **Telegram Mini App** поддержка
- 🔗 **TON Connect** для кошельков
- 📊 **Мониторинг доходов** в реальном времени
- 🎯 **Система заданий** и достижений

## 💰 Монетизация

- **25 энергии** = 0.1 TON (~$0.50)
- **50 энергии** = 0.15 TON (~$0.75)  
- **100 энергии** = 0.25 TON (~$1.25)

**Все платежи поступают на кошелек**: `UQBOxIuUPXHOu1fY0O7uGe9yIIaa0-DRcLIk2qVNa_0tZbFD`

## 🛠️ Технологии

- **Frontend**: React 18, Tailwind CSS, TON Connect
- **Backend**: Node.js, Express, TypeScript  
- **Blockchain**: TON, FunC Smart Contracts
- **Deployment**: GitHub Pages, GitHub Actions

## � Установка

```bash
# Клонируем репозиторий
git clone https://github.com/YOUR_USERNAME/secco-tap-game.git
cd secco-tap-game

# Устанавливаем зависимости
npm install

# Запускаем API сервер
npm run start

# Открываем игру в браузере
# Просто откройте secco-tapgame.html или index.html
```

## 🎯 Использование

### Локальная разработка

```bash
npm run dev          # Запуск с автообновлением
npm run wallet-balance   # Проверка баланса кошелька
npm run monitor-wallet   # Мониторинг транзакций
```

### Telegram Bot Setup

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Добавьте Mini App: `/newapp`
3. URL: `https://YOUR_USERNAME.github.io/secco-tap-game/`
4. Настройте меню: `/setmenubutton`

## 📁 Структура проекта

```
secco-tap-game/
├── index.html              # Telegram Mini App wrapper
├── secco-tapgame.html     # Основная игра
├── manifest.json          # PWA манифест
├── contracts/             # Смарт-контракты TON
├── server/                # API сервер
├── lib/                   # TON HTTP API клиент
├── scripts/               # Утилиты мониторинга
└── .github/workflows/     # GitHub Actions
```
