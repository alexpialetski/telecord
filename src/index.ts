import "dotenv/config";

import { TelegramBot } from "./client/bot.js";
import { startBot } from "./client/web.js";

startBot(TelegramBot);
