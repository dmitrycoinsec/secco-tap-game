import { TonHttpApiClientNoKey } from '../lib/TonHttpApiClientNoKey';

// Ваш кошелек для мониторинга
const YOUR_WALLET = 'UQBOxIuUPXHOu1fY0O7uGe9yIIaa0-DRcLIk2qVNa_0tZbFD';

// TON HTTP API Client (версия без ключа для тестирования)
const tonClient = new TonHttpApiClientNoKey(false); // false = mainnet

// Функция для мониторинга транзакций
async function monitorWalletTransactions() {
    try {
        console.log(`🔍 Мониторинг кошелька: ${YOUR_WALLET}`);
        console.log(`📊 Проверяем поступления от покупок энергии...\n`);

        // Используем новый метод мониторинга
        const walletStats = await tonClient.monitorWalletPayments(YOUR_WALLET);

        console.log(`📈 Статистика кошелька:\n`);

        walletStats.energyTransactions.forEach((tx, index) => {
            console.log(`💰 [ЭНЕРГИЯ] +${tx.amount.toFixed(2)} TON`);
            console.log(`   От: ${tx.from ? tx.from.slice(0, 10) + '...' : 'Неизвестно'}`);
            console.log(`   Время: ${new Date(tx.timestamp * 1000).toLocaleString('ru-RU')}`);
            console.log(`   Хэш: ${tx.hash.slice(0, 16)}...\n`);
        });

        console.log(`📊 СТАТИСТИКА ЭНЕРГИИ:`);
        console.log(`   💎 Всего заработано с энергии: ${walletStats.totalEnergyPayments.toFixed(2)} TON`);
        console.log(`   🔢 Количество покупок энергии: ${walletStats.energyTransactions.length}`);
        console.log(`   💵 Средняя покупка: ${walletStats.energyTransactions.length > 0 ? (walletStats.totalEnergyPayments / walletStats.energyTransactions.length).toFixed(2) : '0'} TON`);
        console.log(`\n💳 Текущий баланс кошелька: ${walletStats.totalBalance.toFixed(2)} TON`);

        if (walletStats.lastTransaction) {
            console.log(`\n� Последняя транзакция: ${new Date(walletStats.lastTransaction.utime * 1000).toLocaleString('ru-RU')}`);
        }

    } catch (error) {
        console.error('❌ Ошибка при мониторинге:', error);
    }
}

// Функция для проверки конкретной транзакции
async function checkSpecificTransaction(txHash: string) {
    try {
        console.log(`🔍 Проверяем транзакцию: ${txHash}`);
        
        // Получаем последние транзакции и ищем нужную
        const transactions = await tonClient.getTransactions(YOUR_WALLET, 100);
        const transaction = transactions.find(tx => tx.hash === txHash);

        if (transaction) {
            console.log(`✅ Транзакция найдена!`);
            console.log(`💰 Сумма: ${transaction.value.toFixed(2)} TON`);
            console.log(`📅 Время: ${new Date(transaction.utime * 1000).toLocaleString('ru-RU')}`);
            console.log(`👤 От: ${transaction.from || 'Неизвестно'}`);
            console.log(`👤 Кому: ${transaction.to || 'Неизвестно'}`);
            
            if (transaction.comment && transaction.comment.includes('SECCO Energy')) {
                console.log(`🎮 Тип: Покупка энергии SECCO`);
            }
        } else {
            console.log(`❌ Транзакция не найдена`);
        }
    } catch (error) {
        console.error('❌ Ошибка при проверке транзакции:', error);
    }
}

// Функция для отображения текущего баланса
async function showCurrentBalance() {
    try {
        const balance = await tonClient.getWalletBalance(YOUR_WALLET);
        
        console.log(`\n💰 Текущий баланс кошелька: ${balance.toFixed(2)} TON`);
        console.log(`   Адрес: ${YOUR_WALLET}`);
        console.log(`   Время проверки: ${new Date().toLocaleString('ru-RU')}\n`);
        
        return balance;
    } catch (error) {
        console.error('❌ Ошибка при получении баланса:', error);
        return 0;
    }
}

// Экспортируем функции
export { monitorWalletTransactions, checkSpecificTransaction, showCurrentBalance };

// Если запускается как основной скрипт
if (require.main === module) {
    const command = process.argv[2];
    
    if (command === 'monitor') {
        monitorWalletTransactions();
    } else if (command === 'balance') {
        showCurrentBalance();
    } else if (command === 'check' && process.argv[3]) {
        checkSpecificTransaction(process.argv[3]);
    } else {
        console.log(`
🎮 SECCO Wallet Monitor

Использование:
  npm run monitor-wallet           - Мониторинг всех транзакций
  npm run wallet-balance          - Показать текущий баланс
  npm run check-tx <hash>         - Проверка конкретной транзакции

Примеры:
  npm run monitor-wallet
  npm run wallet-balance
  npm run check-tx abc123def456...
        `);
    }
}
