import { Message } from "telegraf/typings/core/types/typegram";

import {
  sendPhotoMessage,
  sendTextMessage,
  sendVideoMessage,
} from "./telegramApi.js";
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
  sendTextMessage(buildDiscordMessage(message), replyTo)
    .then((telegramMessage) =>
      Promise.all(
        message.attachments.map((attachment) =>
          sendDiscordAttachment(attachment).catch(() =>
            sendTextMessage(
              `Couldn't send: ${buildLink(attachment.url, attachment.filename)}`
            )
          )
        )
      ).then(() => telegramMessage)
    )
    .then(waitFor(5000));

export const sendDiscordMessageThread = (
  message: APIMessage
): Promise<Message.TextMessage> => {
  if (!message.referenced_message) {
    return sendDiscordMessage(message);
  }

  return sendDiscordMessageThread(message.referenced_message).then(
    (telegramMessage) => sendDiscordMessage(message, telegramMessage.message_id)
  );
};
