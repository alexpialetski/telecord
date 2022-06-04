import "dotenv/config";
import * as readline from "readline";

import { ask } from "./readline.js";
import { searchByLink } from "./main.js";
import { logger } from "./logger.js";

const rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

ask("What is the link?\n", rlInterface)
  .then(searchByLink)
  .catch((err) => logger.error({ err }))
  .finally(() => rlInterface.close());
