const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

// Твой токен бота
const TOKEN = "7725904251:AAFueiMnzNrF9DzomOXSLdUECR5nVa8IAhQ";
// Твой сайт (с HTTPS)
const WEB_APP_URL = "https://ashat-taro.ru";

// Инициализируем бота в режиме long polling
const bot = new TelegramBot(TOKEN, { polling: true });

// Express сервер
const app = express();
const PORT = process.env.PORT || 3001;

// Устанавливаем команды меню для бота
bot.setMyCommands([
  {
    command: "start",
    description: "Начать работу с ботом",
  },
  {
    command: "menu",
    description: "Показать меню",
  },
  {
    command: "help",
    description: "Помощь",
  },
]);

// Если хочешь принимать POST запросы от WebApp
app.use(express.json());

// Функция для создания клавиатуры меню
const getMainKeyboard = () => {
  return {
    keyboard: [
      [{ text: "🚀 Начать" }, { text: "📱 Открыть приложение" }],
      [{ text: "📋 Меню" }, { text: "❓ Помощь" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  };
};

// Обработка команды /start
bot.onText(/\/start(.*)/, (msg, match) => {
  const chatId = msg.chat.id;

  // Получаем параметр из команды
  const startParam = match[1].trim(); // Параметр после /start

  // Формируем URL для веб-приложения
  let url = WEB_APP_URL; // Дефолтный URL

  // Если есть параметр, добавляем его к URL
  if (startParam) {
    // Пример: если параметр "sign-in", то конечный URL будет "https://calm-peas-invent.loca.lt/sign-in"
    url = `${WEB_APP_URL}/${startParam}`; // Формируем конечный URL
  } else {
    // Если параметра нет, используем основной URL
    url = WEB_APP_URL; // Используем основной URL
  }

  // Отправляем приветственное сообщение с клавиатурой
  bot.sendMessage(chatId, "🎉 Добро пожаловать! Выберите действие:", {
    reply_markup: getMainKeyboard(),
  });

  // Отправляем сообщение с открытием веб-приложения
  bot.sendMessage(chatId, "Открой приложение для продолжения работы", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Перейти в приложение",
            web_app: { url: url },
          },
        ],
      ],
    },
  });
});

// Обработка команды /menu
bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "📋 Главное меню:", {
    reply_markup: getMainKeyboard(),
  });
});

// Обработка команды /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpText = `
❓ *Помощь по боту*

Доступные команды:
/start - Начать работу с ботом
/menu - Показать главное меню
/help - Показать это сообщение

Кнопки меню:
🚀 Начать - Запустить приложение
📱 Открыть приложение - Открыть веб-приложение
📋 Меню - Показать главное меню
❓ Помощь - Получить помощь
  `;

  bot.sendMessage(chatId, helpText, {
    parse_mode: "Markdown",
    reply_markup: getMainKeyboard(),
  });
});

// Обработка текстовых сообщений (кнопок)
bot.on("message", (msg) => {
  if (msg?.web_app_data?.data) {
    const data = JSON.parse(msg.web_app_data.data);
    bot.sendMessage(msg.chat.id, `Ты отправил данные: ${JSON.stringify(data)}`);
    return;
  }

  const chatId = msg.chat.id;
  const text = msg.text;

  switch (text) {
    case "🚀 Начать":
      // Эмулируем команду /start
      bot.sendMessage(chatId, "Открой приложение для продолжения работы", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Перейти в приложение",
                web_app: { url: WEB_APP_URL },
              },
            ],
          ],
        },
      });
      break;

    case "📱 Открыть приложение":
      bot.sendMessage(chatId, "Открой приложение для продолжения работы", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Перейти в приложение",
                web_app: { url: WEB_APP_URL },
              },
            ],
          ],
        },
      });
      break;

    case "📋 Меню":
      bot.sendMessage(chatId, "📋 Главное меню:", {
        reply_markup: getMainKeyboard(),
      });
      break;

    case "❓ Помощь":
      const helpText = `
❓ *Помощь по боту*

Доступные команды:
/start - Начать работу с ботом
/menu - Показать главное меню
/help - Показать это сообщение

Кнопки меню:
🚀 Начать - Запустить приложение
📱 Открыть приложение - Открыть веб-приложение
📋 Меню - Показать главное меню
❓ Помощь - Получить помощь
      `;

      bot.sendMessage(chatId, helpText, {
        parse_mode: "Markdown",
        reply_markup: getMainKeyboard(),
      });
      break;
  }
});

// Простой endpoint для теста
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
