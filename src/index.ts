import "dotenv/config";
import * as readline from "readline";

import { sendMessageQueue } from "./telegramService.js";
import {
  searchMessagesAfterTimestamp,
  getMessagesWithReferences,
} from "./discordService.js";
import { ask } from "./readline.js";
import { getMessageById } from "./discordApi.js";
import { parseLink } from "./utils.js";

const rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

ask("What is the link?\n", rlInterface)
  .then((link) => {
    const { channelId, messageId } = parseLink(link);

    if (!messageId || !channelId) {
      throw new Error("Link is broken");
    }

    return getMessageById(channelId, messageId);
  })
  .then((message) => {
    if (!message) {
      throw new Error("Could not find message in general chat");
    }

    return searchMessagesAfterTimestamp(+new Date(message.timestamp));
  })
  .then((res) => res.reverse())
  .then((res) => Promise.all(res.map(getMessagesWithReferences)))
  .then(sendMessageQueue)
  .catch(console.log)
  .finally(() => rlInterface.close());
