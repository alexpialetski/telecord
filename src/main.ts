import {
  searchMessagesAfterTimestamp,
  getMessagesWithReferences,
} from "./discordService.js";
import { getMessageById } from "./discordApi.js";
import { buildLink, parseLink } from "./utils.js";
import { APIMessage } from "./types.js";
import { sendTextMessage } from "./telegramApi.js";
import { sendDiscordMessageThread } from "./telegramService.js";
import { VEEFRIENDS_GUILD } from "./constant.js";

const sendMessageQueue = (messages: APIMessage[], startMessageLink: string) =>
  messages
    .reduce<Promise<unknown>>(
      (acc, message) =>
        acc
          .then(() =>
            sendTextMessage("🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩")
          )
          .then(() => getMessagesWithReferences(message))
          .then(sendDiscordMessageThread),
      Promise.resolve()
    )
    .then(() => {
      const lastMessage = messages.pop();

      const lastMessageLink = lastMessage
        ? `https://discord.com/channels/${VEEFRIENDS_GUILD}/${lastMessage?.channel_id}/${lastMessage?.id}`
        : startMessageLink;

      const htmlLink = buildLink(lastMessageLink, "Last message");

      return sendTextMessage(`🟥🟥🟥🟥🟥🟥${htmlLink}🟥🟥🟥🟥🟥🟥🟥`).then(
        () => ({ lastMessageLink, htmlLink })
      );
    });

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
    .then((messages: APIMessage[]) => sendMessageQueue(messages, link));
};
