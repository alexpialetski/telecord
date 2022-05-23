import {
  ANNOUNCEMENTS_CNANNEL_ID,
  GENERAL_CHANNEL_ID,
  VEEFRIENDS_GUILD,
} from "./constant.js";
import { APIMessage } from "./types.js";

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

export const parseDiscordContent = (content: string): string => {
  const channelMentions = content.replace(/<#(\d+)>/g, (_, channelId: string) =>
    getChannelName(channelId)
  );

  return channelMentions;
};

export const buildDiscordMessage = (message: APIMessage): string =>
  `<b><u>${message.author.username}</u> - ${getChannelName(
    message.channel_id
  )}</b>\n` + parseDiscordContent(message.content);

console.log(
  parseDiscordContent("Pls @everyone check <#836679406092550184> ♥️♥️")
);
