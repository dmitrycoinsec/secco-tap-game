# 🚀 Деплой SECCO Tap Game в Telegram Mini App

## 📋 Пошаговая инструкция

### 1. Загрузка на GitHub

```bash
# Инициализируем git репозиторий
git init

# Добавляем все файлы
git add .

# Делаем первый коммит
git commit -m "🎮 Initial commit: SECCO Tap Game with TON integration"

# Подключаем к GitHub репозиторию
git remote add origin https://github.com/ВАШ_USERNAME/secco-tap-game.git

# Загружаем на GitHub
git push -u origin main
```

### 2. Настройка GitHub Pages

1. Перейдите в настройки вашего репозитория на GitHub
2. В разделе "Pages" выберите:
   - **Source**: Deploy from a branch
   - **Branch**: main
   - **Folder**: / (root)
3. Нажмите "Save"

Ваша игра будет доступна по адресу:
`https://ВАШ_USERNAME.github.io/secco-tap-game/`

### 3. Создание Telegram Mini App

#### Шаг 1: Создайте бота
1. Напишите [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота

#### Шаг 2: Настройте Mini App
1. Отправьте `/newapp` в [@BotFather](https://t.me/BotFather)
2. Выберите вашего бота
3. Укажите данные приложения:
   - **Title**: SECCO Tap Game
   - **Description**: Крипто тапалка с покупкой энергии за TON
   - **Photo**: Загрузите иконку игры (512x512)
   - **Demo GIF/Video**: Опционально
   - **Web App URL**: `https://ВАШ_USERNAME.github.io/secco-tap-game/`

#### Шаг 3: Настройте меню бота
```
/setmenubutton
Выберите вашего бота
Button text: 🎮 Играть
URL: https://ВАШ_USERNAME.github.io/secco-tap-game/
```

### 4. Получение TON API ключа (опционально)

Для расширенного функционала:

1. Перейдите на [toncenter.com](https://toncenter.com/)
2. Зарегистрируйтесь и получите API ключ
3. В настройках GitHub репозитория добавьте Secret:
   - **Name**: `TON_API_KEY`
   - **Value**: ваш_api_ключ

### 5. Тестирование

1. **Локальное тестирование**:
   ```bash
   # Запуск API сервера
   npm run start
   
   # Открыть index.html в браузере
   # или secco-tapgame.html для прямого тестирования
   ```

2. **Тестирование в Telegram**:
   - Откройте вашего бота в Telegram
   - Нажмите кнопку "🎮 Играть"
   - Игра должна открыться в полноэкранном режиме

### 6. Мониторинг доходов

```bash
# Проверка баланса кошелька
npm run wallet-balance

# Мониторинг транзакций
npm run monitor-wallet
```

## 🎯 Важные ссылки

- **Ваш кошелек**: `UQBOxIuUPXHOu1fY0O7uGe9yIIaa0-DRcLIk2qVNa_0tZbFD`
- **TON Connect**: Интегрирован в игру
- **GitHub Actions**: Автоматический деплой при коммитах

## 🔧 Структура для Telegram

```
/
├── index.html              # Главная страница для Telegram Mini App
├── secco-tapgame.html     # Сама игра
├── manifest.json          # PWA манифест
├── .github/workflows/     # CI/CD
└── README-DEPLOY.md       # Эта инструкция
```

## 💡 Советы

1. **Безопасность**: Никогда не коммитьте приватные ключи
2. **Тестирование**: Всегда тестируйте в Telegram Web App перед релизом
3. **Мониторинг**: Регулярно проверяйте поступления TON
4. **Обновления**: GitHub Pages автоматически обновляется при пуше в main

## 🎉 Готово!

После выполнения всех шагов ваша игра будет:
- ✅ Размещена на GitHub
- ✅ Доступна как Telegram Mini App
- ✅ Принимать платежи в TON
- ✅ Автоматически обновляться при изменениях

**Удачи с монетизацией! 💰🎮**
