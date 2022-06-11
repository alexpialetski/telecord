import "dotenv/config";

import { searchByLink } from "./main.js";
import { TelegramBot } from "./telegramApi.js";
import { AUTHOR_TELEGRAM_USER_ID } from "./constant.js";
import { logger, promiseLogger } from "./logger.js";

TelegramBot.on("text", (ctx) => {
  if (ctx.message.from.id === AUTHOR_TELEGRAM_USER_ID) {
    Promise.resolve(ctx.message.text)
      .then(promiseLogger("bot: Link"))
      .then(searchByLink)
      .then(promiseLogger("bot: Last message link"))
      .then(({ htmlLink }) => ctx.reply(htmlLink, { parse_mode: "HTML" }))
      .catch((err) => logger.error({ err }));
  }
});

if (process.env.NODE_ENV === "production") {
  TelegramBot.telegram.setWebhook(
    `${process.env.HEROKU_URL}/${process.env.TELEGRAM_AUTH_TOKEN}}`
  ).catch(err => logger.error({ err }));
}

TelegramBot.launch();

// Enable graceful stop
process.once("SIGINT", () => TelegramBot.stop("SIGINT"));
process.once("SIGTERM", () => TelegramBot.stop("SIGTERM"));

export { TelegramBot };
