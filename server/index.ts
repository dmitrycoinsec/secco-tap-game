import express from 'express';
import cors from 'cors';
import { TonHttpApiClient } from '../lib/TonHttpApiClient';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// TON HTTP API Client
const tonClient = new TonHttpApiClient(
    process.env.TON_API_KEY || '', 
    process.env.NODE_ENV === 'development' // testnet для разработки
);

// Ваш кошелек для получения платежей
const OWNER_WALLET = 'UQBOxIuUPXHOu1fY0O7uGe9yIIaa0-DRcLIk2qVNa_0tZbFD';

// Адрес развернутого контракта (обновится после развертывания)
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || OWNER_WALLET;

// База данных пользователей (в продакшене используйте PostgreSQL/MongoDB)
interface UserData {
    walletAddress: string;
    balance: number;
    energy: number;
    level: number;
    xp: number;
    lastEnergyUpdate: Date;
}

const usersDB = new Map<string, UserData>();

// Endpoint для получения данных пользователя
app.get('/api/user/:walletAddress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        
        let userData = usersDB.get(walletAddress);
        if (!userData) {
            // Создаем нового пользователя
            userData = {
                walletAddress,
                balance: 0,
                energy: 100,
                level: 1,
                xp: 0,
                lastEnergyUpdate: new Date()
            };
            usersDB.set(walletAddress, userData);
        }
        
        // Проверяем восстановление энергии (каждые 12 часов)
        const now = new Date();
        const timeDiff = now.getTime() - userData.lastEnergyUpdate.getTime();
        const hoursPassed = timeDiff / (1000 * 60 * 60);
        
        if (hoursPassed >= 12) {
            userData.energy = 100;
            userData.lastEnergyUpdate = now;
            usersDB.set(walletAddress, userData);
        }
        
        res.json(userData);
    } catch (error) {
        console.error('Error getting user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint для валидации покупки энергии
app.post('/api/validate-energy-purchase', async (req, res) => {
    try {
        const { txHash, walletAddress, energyAmount, tonAmount } = req.body;
        
        console.log(`🔍 Validating energy purchase:`, {
            txHash: txHash?.slice(0, 16) + '...',
            walletAddress: walletAddress?.slice(0, 10) + '...',
            energyAmount,
            tonAmount
        });
        
        // Проверяем транзакцию через TON HTTP API
        const validation = await tonClient.validateEnergyPurchase(
            txHash,
            walletAddress,
            CONTRACT_ADDRESS,
            tonAmount
        );
        
        if (!validation.isValid) {
            console.log(`❌ Transaction validation failed:`, validation.error);
            return res.status(400).json({ error: validation.error });
        }
        
        console.log(`✅ Transaction validated successfully`);
        
        // Обновляем данные пользователя
        const userData = usersDB.get(walletAddress);
        if (userData) {
            userData.energy = Math.min(100, userData.energy + energyAmount);
            usersDB.set(walletAddress, userData);
            
            console.log(`🎮 Energy updated for ${walletAddress.slice(0, 10)}...: +${energyAmount} energy`);
            res.json({ 
                success: true, 
                newEnergy: userData.energy,
                txHash,
                transaction: validation.transaction
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
        
    } catch (error) {
        console.error('❌ Error validating energy purchase:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint для обновления игровых данных
app.post('/api/update-game-data', async (req, res) => {
    try {
        const { walletAddress, balance, energy, level, xp } = req.body;
        
        const userData = usersDB.get(walletAddress);
        if (userData) {
            userData.balance = balance;
            userData.energy = energy;
            userData.level = level;
            userData.xp = xp;
            usersDB.set(walletAddress, userData);
            
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating game data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint для получения статистики контракта
app.get('/api/contract-stats', async (req, res) => {
    try {
        console.log(`📊 Getting contract stats for: ${CONTRACT_ADDRESS}`);
        
        // Получаем статистику через TON HTTP API
        const walletStats = await tonClient.monitorWalletPayments(OWNER_WALLET);
        
        res.json({
            ownerWallet: OWNER_WALLET,
            contractAddress: CONTRACT_ADDRESS,
            totalEnergyPayments: walletStats.totalEnergyPayments,
            energyTransactionsCount: walletStats.energyTransactions.length,
            totalBalance: walletStats.totalBalance,
            recentTransactions: walletStats.energyTransactions.slice(0, 10),
            lastUpdate: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Error getting contract stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Функция валидации транзакции энергии
function validateEnergyTransaction(
    transaction: any,
    walletAddress: string,
    energyAmount: number,
    tonAmount: number
): boolean {
    try {
        // Проверяем, что транзакция от правильного адреса
        if (transaction.inMessage?.source?.toString() !== walletAddress) {
            return false;
        }
        
        // Проверяем сумму транзакции
        const expectedAmount = getExpectedTonAmount(energyAmount);
        if (Math.abs(tonAmount - expectedAmount) > 0.01) { // допуск на газ
            return false;
        }
        
        // Проверяем op code в теле сообщения
        const expectedOpCode = getExpectedOpCode(energyAmount);
        // Здесь нужно парсить тело транзакции и проверить op code
        
        return true;
    } catch (error) {
        console.error('Error validating transaction:', error);
        return false;
    }
}

function getExpectedTonAmount(energyAmount: number): number {
    switch (energyAmount) {
        case 25: return 0.5;
        case 50: return 1.0;
        case 100: return 2.0;
        default: return 0;
    }
}

function getExpectedOpCode(energyAmount: number): number {
    switch (energyAmount) {
        case 25: return 0x12345601;
        case 50: return 0x12345602;
        case 100: return 0x12345603;
        default: return 0;
    }
}

app.listen(port, () => {
    console.log(`🚀 SECCO API Server running on port ${port}`);
    console.log(`� Owner wallet: ${OWNER_WALLET}`);
    console.log(`�📱 Contract address: ${CONTRACT_ADDRESS}`);
    console.log(`🔗 TON HTTP API: ${tonClient.testnet ? 'testnet' : 'mainnet'}`);
    console.log(`🔑 API Key configured: ${process.env.TON_API_KEY ? 'Yes' : 'No'}`);
});
