import axios, { AxiosResponse } from 'axios';

/**
 * TON HTTP API Client
 * Официальный клиент для работы с TON blockchain через HTTP API
 * Документация: https://github.com/toncenter/ton-http-api
 */
export class TonHttpApiClient {
    private apiKey: string;
    private baseURL: string;
    public readonly testnet: boolean;

    constructor(apiKey: string, testnet: boolean = false) {
        this.apiKey = apiKey;
        this.testnet = testnet;
        this.baseURL = testnet 
            ? 'https://testnet.toncenter.com/api/v2'
            : 'https://toncenter.com/api/v2';
    }

    /**
     * Выполняет HTTP запрос к TON API
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
                    'X-API-Key': this.apiKey,
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
     * Получает информацию об аккаунте
     */
    async getAddressInformation(address: string): Promise<any> {
        return this.request('getAddressInformation', { address });
    }

    /**
     * Получает баланс адреса
     */
    async getAddressBalance(address: string): Promise<string> {
        return this.request('getAddressBalance', { address });
    }

    /**
     * Получает транзакции адреса
     */
    async getTransactions(address: string, limit: number = 10, lt?: string, hash?: string): Promise<any[]> {
        const params: any = { address, limit };
        if (lt) params.lt = lt;
        if (hash) params.hash = hash;
        
        return this.request('getTransactions', params);
    }

    /**
     * Отправляет BOC (Bag of Cells) в сеть
     */
    async sendBoc(boc: string): Promise<any> {
        return this.request('sendBoc', { boc });
    }

    /**
     * Получает информацию о смарт-контракте
     */
    async runGetMethod(address: string, method: string, stack: any[] = []): Promise<any> {
        return this.request('runGetMethod', {
            address,
            method,
            stack
        });
    }

    /**
     * Оценивает комиссию за транзакцию
     */
    async estimateFee(address: string, body: string, initCode?: string, initData?: string): Promise<any> {
        const params: any = { address, body };
        if (initCode) params.init_code = initCode;
        if (initData) params.init_data = initData;
        
        return this.request('estimateFee', params);
    }

    /**
     * Получает состояние мастерчейна
     */
    async getMasterchainInfo(): Promise<any> {
        return this.request('getMasterchainInfo');
    }

    /**
     * Ждет подтверждения транзакции
     */
    async waitForTransaction(address: string, lt: string, timeout: number = 60000): Promise<any> {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            try {
                const transactions = await this.getTransactions(address, 1);
                
                if (transactions.length > 0 && transactions[0].transaction_id.lt === lt) {
                    return transactions[0];
                }
                
                // Ждем 2 секунды перед следующей проверкой
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error('Error waiting for transaction:', error);
                throw error;
            }
        }
        
        throw new Error('Transaction confirmation timeout');
    }

    /**
     * Проверяет, является ли адрес валидным
     */
    async isValidAddress(address: string): Promise<boolean> {
        try {
            await this.getAddressInformation(address);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Конвертирует nanoTON в TON
     */
    static nanotonToTon(nanoton: string): number {
        return parseInt(nanoton) / 1000000000;
    }

    /**
     * Конвертирует TON в nanoTON
     */
    static tonToNanoton(ton: number): string {
        return (ton * 1000000000).toString();
    }

    /**
     * Проверяет транзакцию на покупку энергии SECCO
     */
    async validateEnergyPurchase(
        txHash: string, 
        fromAddress: string, 
        toAddress: string, 
        expectedAmount: number
    ): Promise<{ isValid: boolean; transaction?: any; error?: string }> {
        try {
            const transactions = await this.getTransactions(toAddress, 50);
            
            const transaction = transactions.find(tx => 
                tx.transaction_id.hash === txHash
            );

            if (!transaction) {
                return { isValid: false, error: 'Transaction not found' };
            }

            // Проверяем отправителя
            if (transaction.in_msg?.source !== fromAddress) {
                return { isValid: false, error: 'Invalid sender address' };
            }

            // Проверяем сумму (с учетом погрешности на газ)
            const receivedAmount = TonHttpApiClient.nanotonToTon(transaction.in_msg?.value || '0');
            const expectedNanoTon = expectedAmount * 1000000000;
            const receivedNanoTon = parseInt(transaction.in_msg?.value || '0');
            
            if (Math.abs(receivedNanoTon - expectedNanoTon) > 50000000) { // 0.05 TON погрешность
                return { 
                    isValid: false, 
                    error: `Amount mismatch: expected ${expectedAmount} TON, received ${receivedAmount} TON` 
                };
            }

            // Проверяем, что транзакция успешна
            if (!transaction.in_msg) {
                return { isValid: false, error: 'No incoming message in transaction' };
            }

            return { isValid: true, transaction };

        } catch (error) {
            return { 
                isValid: false, 
                error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
            };
        }
    }

    /**
     * Мониторинг поступлений на кошелек SECCO
     */
    async monitorWalletPayments(walletAddress: string): Promise<{
        totalEnergyPayments: number;
        energyTransactions: any[];
        totalBalance: number;
        lastTransaction?: any;
    }> {
        try {
            const transactions = await this.getTransactions(walletAddress, 50);
            const balance = await this.getAddressBalance(walletAddress);
            
            let totalEnergyPayments = 0;
            const energyTransactions: any[] = [];

            transactions.forEach(tx => {
                if (tx.in_msg) {
                    const amount = TonHttpApiClient.nanotonToTon(tx.in_msg.value || '0');
                    
                    // Проверяем, является ли это платежом за энергию (по сумме)
                    if (amount === 0.5 || amount === 1.0 || amount === 2.0) {
                        totalEnergyPayments += amount;
                        energyTransactions.push({
                            hash: tx.transaction_id.hash,
                            amount: amount,
                            from: tx.in_msg.source,
                            timestamp: tx.utime,
                            lt: tx.transaction_id.lt
                        });
                    }
                }
            });

            return {
                totalEnergyPayments,
                energyTransactions,
                totalBalance: TonHttpApiClient.nanotonToTon(balance),
                lastTransaction: transactions[0] || null
            };

        } catch (error) {
            console.error('Error monitoring wallet payments:', error);
            throw error;
        }
    }
}
