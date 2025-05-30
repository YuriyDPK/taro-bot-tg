const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

// Твой токен бота
const TOKEN = "8095226690:AAHSVO9lpHnkyah68goy6bmNjBjQ9gz9se0";
// Твой сайт (с HTTPS)
const WEB_APP_URL = "https://like-auto.codex-it.ru/";

// Инициализируем бота в режиме long polling
const bot = new TelegramBot(TOKEN, { polling: true });

// Express сервер
const app = express();
const PORT = process.env.PORT || 3001;

// Если хочешь принимать POST запросы от WebApp
app.use(express.json());

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

  // Отправляем сообщение с открытием веб-приложения
  bot.sendMessage(chatId, "Открой приложение для продолжения", {
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

// Обработка данных от WebApp
bot.on("message", (msg) => {
  if (msg?.web_app_data?.data) {
    const data = JSON.parse(msg.web_app_data.data);
    bot.sendMessage(msg.chat.id, `Ты отправил данные: ${JSON.stringify(data)}`);
  }
});

// Простой endpoint для теста
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
