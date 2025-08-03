import axios, { AxiosResponse } from 'axios';

/**
 * TON HTTP API Client (версия без API ключа для тестирования)
 * Официальный клиент для работы с TON blockchain через HTTP API
 * Документация: https://github.com/toncenter/ton-http-api
 */
export class TonHttpApiClientNoKey {
    private baseURL: string;
    public readonly testnet: boolean;

    constructor(testnet: boolean = false) {
        this.testnet = testnet;
        this.baseURL = testnet 
            ? 'https://testnet.toncenter.com/api/v2'
            : 'https://toncenter.com/api/v2';
    }

    /**
     * Выполняет HTTP запрос к TON API без API ключа
     */
    private async request(method: string, params: any = {}): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(`${this.baseURL}/jsonRPC`, {
                id: Date.now(),
                jsonrpc: '2.0',
                method,
                params
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.error) {
                throw new Error(`TON API Error: ${response.data.error.message}`);
            }

            return response.data.result;
        } catch (error) {
            console.error(`TON HTTP API request failed:`, error);
            throw error;
        }
    }

    /**
     * Получает информацию об аккаунте (работает без API ключа)
     */
    async getAddressInformation(address: string): Promise<any> {
        return this.request('getAddressInformation', { address });
    }

    /**
     * Получает транзакции адреса (работает без API ключа с ограничениями)
     */
    async getTransactions(address: string, limit: number = 10): Promise<any[]> {
        const result = await this.request('getTransactions', { 
            address, 
            limit,
            to_lt: 0,
            archival: false
        });
        
        return result || [];
    }

    /**
     * Получает баланс кошелька
     */
    async getWalletBalance(address: string): Promise<number> {
        const addressInfo = await this.getAddressInformation(address);
        return parseFloat(addressInfo.balance) / 1000000000; // Конвертируем в TON
    }

    /**
     * Мониторинг платежей за энергию
     */
    async monitorWalletPayments(address: string): Promise<{
        totalBalance: number;
        totalEnergyPayments: number;
        energyTransactions: any[];
        lastTransaction: any;
    }> {
        const transactions = await this.getTransactions(address, 50);
        const addressInfo = await this.getAddressInformation(address);
        
        const energyTransactions = transactions.filter(tx => {
            // Проверяем комментарии или тело сообщения на наличие маркеров энергии
            const comment = tx.in_msg?.message || '';
            return comment.includes('SECCO') || comment.includes('Energy') || comment.includes('energy');
        });

        const totalEnergyPayments = energyTransactions.reduce((sum, tx) => {
            return sum + (parseFloat(tx.in_msg?.value || '0') / 1000000000);
        }, 0);

        return {
            totalBalance: parseFloat(addressInfo.balance) / 1000000000,
            totalEnergyPayments,
            energyTransactions: energyTransactions.map(tx => ({
                hash: tx.transaction_id.hash,
                amount: parseFloat(tx.in_msg?.value || '0') / 1000000000,
                from: tx.in_msg?.source,
                timestamp: tx.utime,
                comment: tx.in_msg?.message || ''
            })),
            lastTransaction: transactions[0] || null
        };
    }
}

export default TonHttpApiClientNoKey;
