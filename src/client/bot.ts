import "dotenv/config";

import { handleLastMessageLinks, postByLinks } from "../main.js";
import { TelegramBot } from "../telegram/telegramApi.js";
import { AUTHOR_TELEGRAM_USER_ID } from "../constant.js";
import { logger, promiseLogger } from "../utils/logger.js";

TelegramBot.on("text", (ctx) => {
  if (ctx.message.from.id === AUTHOR_TELEGRAM_USER_ID) {
    Promise.resolve({ garyVee: ctx.message.text })
      .then(promiseLogger("bot: Link"))
      .then(postByLinks)
      .then(handleLastMessageLinks({ save: false }))
      .then(() => ctx.reply("Done"))
      .catch((err) => logger.error({ err }));
  }
});

if (process.env.NODE_ENV === "production") {
  TelegramBot.telegram
    .setWebhook(`${process.env.HEROKU_URL}/${process.env.TELEGRAM_AUTH_TOKEN}}`)
    .catch((err) => logger.error({ err }));
}

TelegramBot.launch();

// Enable graceful stop
process.once("SIGINT", () => TelegramBot.stop("SIGINT"));
process.once("SIGTERM", () => TelegramBot.stop("SIGTERM"));

export { TelegramBot };
