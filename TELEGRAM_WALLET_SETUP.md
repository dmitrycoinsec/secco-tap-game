# 📱 SECCO Tap Game - Telegram Wallet Integration Guide

## 🔗 TON Connect Integration

SECCO Tap Game использует TON Connect для интеграции с Telegram Wallet, обеспечивая безопасное подключение кошелька и транзакции.

### 🚀 Основные возможности:

- **Подключение Telegram Wallet** - Безопасное подключение через TON Connect
- **Просмотр баланса** - Отображение TON и токенов
- **Транзакции** - Отправка и получение криптовалюты
- **Смарт-контракты** - Взаимодействие с DeFi протоколами

## 📋 Настройка TON Connect

### 1. Структура файлов

```
secco-tap-game/
├── index.html                 # Основное приложение с TON Connect
├── tonconnect-manifest.json   # Манифест для TON Connect
└── bot.py                     # Telegram бот
```

### 2. TON Connect Manifest (`tonconnect-manifest.json`)

```json
{
  "url": "https://dmitrycoinsec.github.io/secco-tap-game/",
  "name": "SECCO Tap Game",
  "iconUrl": "https://dmitrycoinsec.github.io/secco-tap-game/icon-192.png",
  "termsOfUseUrl": "https://secco.network/terms",
  "privacyPolicyUrl": "https://secco.network/privacy"
}
```

### 3. Интеграция в HTML

```html
<!-- TON Connect UI -->
<script src="https://cdn.jsdelivr.net/npm/@tonconnect/ui@latest/dist/tonconnect-ui.min.js"></script>

<script>
// Инициализация TON Connect
const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://dmitrycoinsec.github.io/secco-tap-game/tonconnect-manifest.json',
  buttonRootId: 'walletBtn'
});

// Обработка подключения кошелька
tonConnectUI.onStatusChange(wallet => {
  if (wallet) {
    console.log('Кошелек подключен:', wallet.account.address);
    updateWalletUI(wallet);
  } else {
    console.log('Кошелек отключен');
    updateWalletUI(null);
  }
});
</script>
```

## 🔧 Функции Telegram Wallet

### 1. Подключение кошелька

```javascript
function connectWallet() {
  if (tonConnectUI) {
    if (walletConnected) {
      tonConnectUI.disconnect();
    } else {
      tonConnectUI.connectWallet();
    }
  }
}
```

### 2. Отправка транзакций

```javascript
async function sendTransaction() {
  if (!walletConnected) {
    alert('Подключите кошелек для отправки транзакций');
    return;
  }

  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
      {
        address: "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F", // destination
        amount: "20000000", // 0.02 TON in nanoTON
        payload: "te6cckEBAQEADAAMABQAAAAASGVsbG8hCaTc/g==" // optional comment in boc format
      }
    ]
  };

  try {
    const result = await tonConnectUI.sendTransaction(transaction);
    console.log('Транзакция отправлена:', result.boc);
    alert('Транзакция успешно отправлена!');
  } catch (error) {
    console.error('Ошибка транзакции:', error);
    alert('Ошибка при отправке транзакции');
  }
}
```

### 3. Проверка баланса

```javascript
async function checkBalance(address) {
  try {
    const response = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Ошибка получения баланса:', error);
    return null;
  }
}
```

## 🎮 Игровая интеграция

### 1. Вывод игровых токенов

```javascript
function withdrawSECCO() {
  if (!walletConnected) {
    alert('Подключите Telegram Wallet для вывода');
    return;
  }

  if (balance < 1000) {
    alert('Минимальная сумма для вывода: $1000 SECCO');
    return;
  }

  // Логика конвертации SECCO в реальную криптовалюту
  const tonAmount = Math.floor(balance / 1000); // 1000 SECCO = 1 TON
  
  // Отправка транзакции
  sendWithdrawalTransaction(tonAmount);
}
```

### 2. Покупка энергии за TON

```javascript
async function buyEnergyWithTON(energyAmount) {
  const tonCost = energyAmount * 0.001; // 1000 энергии = 1 TON
  
  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
      {
        address: "SECCO_GAME_CONTRACT_ADDRESS",
        amount: (tonCost * 1000000000).toString(), // Convert to nanoTON
        payload: createEnergyPurchasePayload(energyAmount)
      }
    ]
  };

  try {
    await tonConnectUI.sendTransaction(transaction);
    energy += energyAmount;
    saveGame();
    updateDisplay();
    alert(`Куплено ${energyAmount} энергии за ${tonCost} TON`);
  } catch (error) {
    alert('Ошибка покупки энергии');
  }
}
```

## 📊 Мониторинг транзакций

### 1. История транзакций

```javascript
async function getTransactionHistory(address) {
  try {
    const response = await fetch(`https://toncenter.com/api/v2/getTransactions?address=${address}&limit=10`);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Ошибка получения истории:', error);
    return [];
  }
}
```

### 2. Уведомления о транзакциях

```javascript
tonConnectUI.onStatusChange(wallet => {
  if (wallet) {
    // Подписка на события кошелька
    startTransactionMonitoring(wallet.account.address);
  }
});

function startTransactionMonitoring(address) {
  setInterval(async () => {
    const history = await getTransactionHistory(address);
    checkForNewTransactions(history);
  }, 10000); // Проверка каждые 10 секунд
}
```

## 🔐 Безопасность

### 1. Валидация адресов

```javascript
function isValidTonAddress(address) {
  const tonAddressRegex = /^[0-9a-fA-F]{64}$|^[A-Za-z0-9_-]{48}$/;
  return tonAddressRegex.test(address);
}
```

### 2. Ограничения транзакций

```javascript
const TRANSACTION_LIMITS = {
  minWithdrawal: 1000, // SECCO
  maxWithdrawal: 100000, // SECCO
  dailyLimit: 50000 // SECCO
};

function validateWithdrawal(amount) {
  if (amount < TRANSACTION_LIMITS.minWithdrawal) {
    throw new Error('Сумма меньше минимальной');
  }
  
  if (amount > TRANSACTION_LIMITS.maxWithdrawal) {
    throw new Error('Сумма превышает максимальную');
  }
  
  // Дополнительные проверки...
}
```

## 🚀 Развертывание

### 1. GitHub Pages

1. Загрузите все файлы в репозиторий
2. Включите GitHub Pages в настройках
3. Убедитесь, что `tonconnect-manifest.json` доступен по прямой ссылке

### 2. Telegram Bot настройка

```python
# bot.py
WEB_APP_URL = "https://dmitrycoinsec.github.io/secco-tap-game/"

# Добавьте команду для кошелька
async def wallet_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = InlineKeyboardMarkup([[
        InlineKeyboardButton("💰 Открыть игру", web_app=WebAppInfo(url=WEB_APP_URL))
    ]])
    
    await update.message.reply_text(
        "🔗 Подключите Telegram Wallet в игре для:\n"
        "• Вывода токенов\n"
        "• Покупки энергии\n"
        "• Торговли NFT",
        reply_markup=keyboard
    )
```

## 📱 Тестирование

### 1. В Telegram

1. Откройте игру через бота
2. Нажмите "Connect Wallet"
3. Выберите Telegram Wallet
4. Подтвердите подключение

### 2. В браузере

- Игра работает и без кошелька
- Функции кошелька будут недоступны
- Отображается соответствующее уведомление

## 🔄 Обновления

- **TON Connect SDK** автоматически обновляется
- **Манифест** можно обновлять без перезапуска
- **Смарт-контракты** деплоятся отдельно

---

## 📞 Поддержка

Если у вас есть вопросы по интеграции Telegram Wallet:

- 📧 Email: support@secco.network
- 💬 Telegram: @secco_support
- 📖 Документация: [TON Connect Docs](https://docs.ton.org/develop/dapps/ton-connect/overview)

**BlackRock is the past — CoinSecurities begins a new era of investing!** 🚀
