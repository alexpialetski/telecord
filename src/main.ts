import { sendMessageQueue } from "./telegramService.js";
import {
  searchMessagesAfterTimestamp,
  getMessagesWithReferences,
} from "./discordService.js";
import { getMessageById } from "./discordApi.js";
import { parseLink } from "./utils.js";

export const searchByLink = (link: string) => {
  const { channelId, messageId } = parseLink(link);

  if (!messageId || !channelId) {
    throw new Error("Link is broken");
  }

  return getMessageById(channelId, messageId)
    .then((message) => {
      if (!message) {
        throw new Error("Could not find message in general chat");
      }

      return searchMessagesAfterTimestamp(+new Date(message.timestamp));
    })
    .then((res) => res.reverse())
    .then((res) => Promise.all(res.map(getMessagesWithReferences)))
    .then(sendMessageQueue);
};
