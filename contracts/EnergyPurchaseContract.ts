import { 
    Contract, 
    ContractProvider, 
    Sender, 
    Address, 
    Cell, 
    beginCell, 
    contractAddress,
    toNano 
} from '@ton/core';

export class EnergyPurchaseContract implements Contract {
    constructor(
        readonly address: Address, 
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromAddress(address: Address) {
        return new EnergyPurchaseContract(address);
    }

    static createFromConfig(config: {
        ownerAddress: Address;
        energyPrice25: bigint;
        energyPrice50: bigint;
        energyPrice100: bigint;
    }, code: Cell, workchain = 0) {
        const data = beginCell()
            .storeAddress(config.ownerAddress)
            .storeCoins(0) // total_ton_collected начинается с 0
            .storeCoins(config.energyPrice25)
            .storeCoins(config.energyPrice50)
            .storeCoins(config.energyPrice100)
            .endCell();
        
        const init = { code, data };
        return new EnergyPurchaseContract(contractAddress(workchain, init), init);
    }

    async sendBuyEnergy25(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: 1 + 2, // PAY_GAS_SEPARATELY + IGNORE_ERRORS
            body: beginCell()
                .storeUint(0x12345601, 32) // op::buy_energy_25
                .storeUint(0, 64) // query_id
                .endCell(),
        });
    }

    async sendBuyEnergy50(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: 1 + 2,
            body: beginCell()
                .storeUint(0x12345602, 32) // op::buy_energy_50
                .storeUint(0, 64)
                .endCell(),
        });
    }

    async sendBuyEnergy100(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: 1 + 2,
            body: beginCell()
                .storeUint(0x12345603, 32) // op::buy_energy_100
                .storeUint(0, 64)
                .endCell(),
        });
    }

    async sendWithdraw(provider: ContractProvider, via: Sender, amount: bigint) {
        await provider.internal(via, {
            value: toNano('0.05'), // газ для операции
            sendMode: 1 + 2,
            body: beginCell()
                .storeUint(0x12345604, 32) // op::withdraw
                .storeUint(0, 64)
                .storeCoins(amount)
                .endCell(),
        });
    }

    async getTotalCollected(provider: ContractProvider): Promise<bigint> {
        const result = await provider.get('get_total_collected', []);
        return result.stack.readBigNumber();
    }

    async getEnergyPrices(provider: ContractProvider): Promise<{
        price25: bigint;
        price50: bigint;
        price100: bigint;
    }> {
        const result = await provider.get('get_energy_prices', []);
        return {
            price25: result.stack.readBigNumber(),
            price50: result.stack.readBigNumber(),
            price100: result.stack.readBigNumber(),
        };
    }

    async getOwnerAddress(provider: ContractProvider): Promise<Address> {
        const result = await provider.get('get_owner_address', []);
        return result.stack.readAddress();
    }
}
