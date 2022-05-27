import "dotenv/config";
import * as readline from "readline";

import { ask } from "./readline.js";
import { searchByLink } from "./main.js";

const rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

ask("What is the link?\n", rlInterface)
  .then(searchByLink)
  .catch(console.log)
  .finally(() => rlInterface.close());
