import { Telegraf } from "telegraf";
import { ExtraReplyMessage } from "telegraf/typings/telegram-types";

import { waitFor } from "../utils/utils.js";
import { TELEGRAM_CHANNEL_ID } from "../constant.js";

export const TelegramBot = new Telegraf(process.env.TELEGRAM_AUTH_TOKEN || "");

const sendTextMessage = (
  message: string,
  replyToMessageId?: number,
  options: ExtraReplyMessage = {}
) =>
  TelegramBot.telegram.sendMessage(TELEGRAM_CHANNEL_ID, message, {
    reply_to_message_id: replyToMessageId,
    parse_mode: "HTML",
    ...options,
  });

const sendGif = (url: string) =>
  TelegramBot.telegram.sendAnimation(TELEGRAM_CHANNEL_ID, url);

const sendVideoMessage = (url: string) =>
  TelegramBot.telegram.sendVideo(TELEGRAM_CHANNEL_ID, url);

const sendPhotoMessage = (url: string) =>
  TelegramBot.telegram.sendPhoto(TELEGRAM_CHANNEL_ID, url);

class RateLimittedTelegramAPI {
  timeout: number;

  constructor(requestsPerMinute: number) {
    this.timeout = 60 / (requestsPerMinute - 3);
  }

  sendTextMessage(...params: Parameters<typeof sendTextMessage>) {
    return sendTextMessage(...params).then(waitFor(this.timeout * 1000));
  }

  sendGif(...params: Parameters<typeof sendGif>) {
    return sendGif(...params).then(waitFor(this.timeout * 1000));
  }

  sendVideoMessage(...params: Parameters<typeof sendVideoMessage>) {
    return sendVideoMessage(...params).then(waitFor(this.timeout * 1000));
  }

  sendPhotoMessage(...params: Parameters<typeof sendPhotoMessage>) {
    return sendPhotoMessage(...params).then(waitFor(this.timeout * 1000));
  }
}

export const telagramAPI = new RateLimittedTelegramAPI(20);
