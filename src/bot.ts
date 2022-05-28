import "dotenv/config";

import { searchByLink } from "./main.js";
import { TelegramBot } from "./telegramApi.js";
import { AUTHOR_TELEGRAM_USER_ID } from "./constant.js";

TelegramBot.on("text", (ctx) => {
  if (ctx.message.from.id === AUTHOR_TELEGRAM_USER_ID) {
    Promise.resolve(ctx.message.text)
      .then(searchByLink)
      .then(({ htmlLink }) => ctx.reply(htmlLink, { parse_mode: "HTML" }))
      .catch(console.log);
  }
});

if (process.env.NODE_ENV === "production") {
  TelegramBot.telegram.setWebhook(
    `${process.env.HEROKU_URL}/${process.env.TELEGRAM_AUTH_TOKEN}}`
  );
}

TelegramBot.launch();

// Enable graceful stop
process.once("SIGINT", () => TelegramBot.stop("SIGINT"));
process.once("SIGTERM", () => TelegramBot.stop("SIGTERM"));

export { TelegramBot };
