import "dotenv/config";

import { searchByLink } from "./main.js";
import { TelegramBot } from "./telegramApi.js";
import { AUTHOR_TELEGRAM_USER_ID } from "./constant.js";

TelegramBot.on("text", (ctx) => {
  if (ctx.message.from.id === AUTHOR_TELEGRAM_USER_ID) {
    Promise.resolve(ctx.message.text)
      .then(searchByLink)
      .then((link) => ctx.reply(link, { parse_mode: "HTML" }))
      .catch(console.log);
  }
});

TelegramBot.launch();

// Enable graceful stop
process.once("SIGINT", () => TelegramBot.stop("SIGINT"));
process.once("SIGTERM", () => TelegramBot.stop("SIGTERM"));
