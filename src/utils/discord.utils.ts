import { VEEFRIENDS_GUILD } from "../constant.js";
import { APIMessage } from "../types.js";

export const buildDiscordMessageLink = (message: APIMessage) =>
  `https://discord.com/channels/${VEEFRIENDS_GUILD}/${message.channel_id}/${message.id}`;
