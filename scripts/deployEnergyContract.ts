import { toNano, Address } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { EnergyPurchaseContract } from '../contracts/EnergyPurchaseContract';

export async function run(provider: NetworkProvider) {
    // Компилируем контракт
    const energyPurchaseCode = await compile('EnergyPurchase');
    
    // Конфигурация контракта
    const ownerAddress = Address.parse('UQBOxIuUPXHOu1fY0O7uGe9yIIaa0-DRcLIk2qVNa_0tZbFD'); // Ваш кошелек для получения платежей
    
    const energyPurchase = EnergyPurchaseContract.createFromConfig({
        ownerAddress,
        energyPrice25: toNano('0.5'),   // 0.5 TON за 25 энергии
        energyPrice50: toNano('1.0'),   // 1.0 TON за 50 энергии
        energyPrice100: toNano('2.0'),  // 2.0 TON за 100 энергии
    }, energyPurchaseCode);

    const energyPurchaseContract = provider.open(energyPurchase);

    // Развертываем контракт
    await energyPurchaseContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(energyPurchase.address);

    console.log('✅ Energy Purchase Contract deployed at:', energyPurchase.address.toString());
    console.log('🔗 Explorer link: https://tonviewer.com/' + energyPurchase.address.toString());
    
    // Проверяем начальные данные
    const prices = await energyPurchaseContract.getEnergyPrices();
    const owner = await energyPurchaseContract.getOwnerAddress();
    
    console.log('📊 Contract details:');
    console.log('   Owner:', owner.toString());
    console.log('   Price for 25 energy:', prices.price25.toString(), 'nanoTON');
    console.log('   Price for 50 energy:', prices.price50.toString(), 'nanoTON');
    console.log('   Price for 100 energy:', prices.price100.toString(), 'nanoTON');
    
    return energyPurchase.address.toString();
}
