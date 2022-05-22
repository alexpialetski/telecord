import { Telegraf } from "telegraf";
import { ExtraReplyMessage } from "telegraf/typings/telegram-types";

import { TELEGRAM_CHANNEL_ID } from "./constant.js";

const TelegramBot = new Telegraf(process.env.TELEGRAM_AUTH_TOKEN || "");

export const sendTextMessage = (
  message: string,
  replyToMessageId?: number,
  options: ExtraReplyMessage = {}
) =>
  TelegramBot.telegram.sendMessage(TELEGRAM_CHANNEL_ID, message, {
    reply_to_message_id: replyToMessageId,
    ...options,
  });

export const sendVideoMessage = (url: string) =>
  TelegramBot.telegram.sendVideo(TELEGRAM_CHANNEL_ID, url);

export const sendPhotoMessage = (url: string) =>
  TelegramBot.telegram.sendPhoto(TELEGRAM_CHANNEL_ID, url);