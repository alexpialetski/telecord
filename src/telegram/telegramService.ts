import { NEW_MESSAGES_GIFS, NO_MESSAGES_GIFS } from "../constant.js";
import { Message } from "telegraf/typings/core/types/typegram";

import { telagramAPI } from "./telegramApi.js";
import { APIAttachment, APIMessage } from "../types.js";
import {
  buildDiscordMessage,
  buildLink,
  randomizeGif,
} from "../utils/utils.js";

export const sendDiscordAttachment = (attachment: APIAttachment) => {
  if (attachment.content_type === "image/jpeg") {
    return telagramAPI.sendPhotoMessage(attachment.url);
  }

  if (attachment.content_type === "video/quicktime") {
    return telagramAPI.sendVideoMessage(attachment.url);
  }

  return telagramAPI.sendTextMessage(attachment.url);
};

export const sendDiscordMessage = (message: APIMessage, replyTo?: number) =>
  telagramAPI
    .sendTextMessage(buildDiscordMessage(message), replyTo)
    .then((telegramMessage) =>
      Promise.all(
        message.attachments.map((attachment) =>
          sendDiscordAttachment(attachment).catch(() =>
            telagramAPI.sendTextMessage(
              `Couldn't send: ${buildLink(attachment.url, attachment.filename)}`
            )
          )
        )
      ).then(() => telegramMessage)
    );

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

export const sendErrorMessage = (errorMessage: string) =>
  telagramAPI.sendTextMessage(`❗Error: ${errorMessage}`);

export const sendSadGif = () =>
  telagramAPI.sendGif(randomizeGif(NO_MESSAGES_GIFS));

export const sendHappyGif = () =>
  telagramAPI.sendGif(randomizeGif(NEW_MESSAGES_GIFS));
