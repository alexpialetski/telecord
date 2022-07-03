import "dotenv/config";
import * as readline from "readline";

import { ask } from "../utils/readline.js";
import { handleLastMessageLinks, postByLinks } from "../main.js";
import { logger, promiseLogger } from "../utils/logger.js";

const rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

ask("What is the link?\n", rlInterface)
  .then((link) => ({ garyVee: link }))
  .then(promiseLogger("bot: Link"))
  .then(postByLinks)
  .then(handleLastMessageLinks({ save: false }))
  .catch((err) => logger.error({ err }))
  .finally(() => rlInterface.close());
