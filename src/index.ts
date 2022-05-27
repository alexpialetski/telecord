import "dotenv/config";

import { TelegramBot } from "./bot.js";
import { startBot } from "./web.js";

startBot(TelegramBot);
