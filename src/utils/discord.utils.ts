import { APIMessage } from "types";

export const buildDiscordMessageLink = (message: APIMessage) =>
  `https://discord.com/channels/${message.guild_id}/${message.channel_id}/${message.id}`;
