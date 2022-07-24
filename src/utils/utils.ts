import {
  ANNOUNCEMENTS_CNANNEL_ID,
  GARY_VEE_ID,
  GENERAL_CHANNEL_ID,
  VEEFRIENDS_GUILD,
} from "../constant.js";
import { APIMessage } from "../types.js";

export const parseLink = (link: string) => {
  const splittedLink = link.split("/").reverse();

  return { messageId: splittedLink[0], channelId: splittedLink[1] };
};

export const getChannelName = (channelId: string): string => {
  if (channelId === GENERAL_CHANNEL_ID) {
    return "#general";
  }

  if (channelId === ANNOUNCEMENTS_CNANNEL_ID) {
    return "#announcements";
  }

  return `<a href="https://discord.com/channels/${VEEFRIENDS_GUILD}/${channelId}">#${channelId}</a>`;
};

export const getPersonName = (personId: string): string => {
  if (personId === GARY_VEE_ID) {
    return "@garyvee";
  }

  return `@${personId}`;
};

export const parseDiscordContent = (content: string): string =>
  content
    .replace(/<#(\d+)>/g, (_, channelId: string) => getChannelName(channelId))
    .replace(/<@(\d+)>/g, (_, personId: string) => getPersonName(personId))
    .replace(/<@!(\d+)>/g, (_, personId: string) => getPersonName(personId))
    .replace(/<:(\w+):(\d+)>/g, ":$1");

export const buildDiscordMessage = (message: APIMessage): string =>
  `<b><u>${message.author.username}</u> - ${stringifyTimestamp(
    message.timestamp
  )} - ${getChannelName(message.channel_id)}</b>\n` +
  parseDiscordContent(message.content);

export const waitFor =
  <T>(timeout: number) =>
  (prevValue: T) =>
    new Promise<T>((res, _) => setTimeout(() => res(prevValue), timeout));

export const buildLink = (url: string, text: string) =>
  `<a href="${url}">${text}</a>`;

export const randomizeItem = (gifs: string[]): string =>
  gifs[Math.floor(Math.random() * gifs.length)];

export const stringifyTimestamp = (timestamp: string): string =>
  new Date(timestamp).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    timeZone: "Europe/Minsk",
  });
