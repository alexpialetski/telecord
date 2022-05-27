import { Message } from "telegraf/typings/core/types/typegram";

import {
  sendPhotoMessage,
  sendTextMessage,
  sendVideoMessage,
} from "./telegramApi.js";
import { VEEFRIENDS_GUILD } from "./constant.js";
import { APIAttachment, APIMessage } from "./types.js";
import { buildDiscordMessage, buildLink, waitFor } from "./utils.js";

export const sendDiscordAttachment = (attachment: APIAttachment) => {
  if (attachment.content_type === "image/jpeg") {
    return sendPhotoMessage(attachment.url);
  }

  if (attachment.content_type === "video/quicktime") {
    return sendVideoMessage(attachment.url);
  }

  return sendTextMessage(attachment.url);
};

export const sendDiscordMessage = (message: APIMessage, replyTo?: number) =>
  sendTextMessage(buildDiscordMessage(message), replyTo, {
    parse_mode: "HTML",
  })
    .then((telegramMessage) =>
      Promise.all(
        message.attachments.map((attachment) =>
          sendDiscordAttachment(attachment).catch(() =>
            sendTextMessage(
              `Couldn't send: ${buildLink(
                attachment.url,
                attachment.filename
              )}`,
              undefined,
              {
                parse_mode: "HTML",
              }
            )
          )
        )
      ).then(() => telegramMessage)
    )
    .then(waitFor(5000));

export const sendMessageThread = (
  message: APIMessage
): Promise<Message.TextMessage> => {
  if (!message.referenced_message) {
    return sendDiscordMessage(message);
  }

  return sendMessageThread(message.referenced_message).then((telegramMessage) =>
    sendDiscordMessage(message, telegramMessage.message_id)
  );
};

export const sendMessageQueue = (messages: APIMessage[]): Promise<string> =>
  messages
    .reduce<Promise<unknown>>(
      (acc, message) =>
        acc
          .then(() =>
            sendTextMessage("🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩")
          )
          .then(() => sendMessageThread(message)),
      Promise.resolve()
    )
    .then(() => {
      const lastMessage = messages.pop();
      const lastMessageLink = buildLink(
        `https://discord.com/channels/${VEEFRIENDS_GUILD}/${lastMessage?.channel_id}/${lastMessage?.id}`,
        "Last message"
      );

      return sendTextMessage(
        `🟥🟥🟥🟥🟥🟥${lastMessageLink}🟥🟥🟥🟥🟥🟥🟥`,
        undefined,
        { parse_mode: "HTML" }
      ).then(() => lastMessageLink);
    });
