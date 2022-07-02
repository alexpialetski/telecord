import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { APIMessage, SearchMessages } from "./types.js";
import {
  ANNOUNCEMENTS_CNANNEL_ID,
  GARY_VEE_ID,
  VEEFRIENDS_GUILD,
} from "./constant.js";

const axiosInstance = axios.create({
  headers: {
    Authorization: process.env.DISCORD_AUTH_TOKEN || "",
  },
});

axiosInstance.interceptors.response.use(
  undefined,
  async (error: AxiosError<{ retry_after: number }>) => {
    const retryAfter = error.response?.data?.retry_after;

    if (error.response?.status === 429 && retryAfter) {
      return new Promise<AxiosRequestConfig>((res) =>
        setTimeout(() => res(error.config), (retryAfter + 1) * 1000)
      ).then(axiosInstance.request);
    }

    return Promise.reject(error);
  }
);

type SearchMessagesParams = {
  offset?: number;
  guildId?: string;
  authorId?: string;
  channelId?: string;
};

export const searchMessagesFromAuthor = ({
  authorId = GARY_VEE_ID,
  ...rest
}: Pick<SearchMessagesParams, "authorId" | "offset">): Promise<APIMessage[]> =>
  searchMessages({ authorId, ...rest });

export const searchMessagesFromChannel = ({
  channelId = ANNOUNCEMENTS_CNANNEL_ID,
  ...rest
}: Pick<SearchMessagesParams, "channelId" | "offset">): Promise<APIMessage[]> =>
  searchMessages({ channelId, ...rest });

export const searchMessages = ({
  offset,
  guildId = VEEFRIENDS_GUILD,
  authorId,
  channelId,
}: SearchMessagesParams = {}): Promise<APIMessage[]> =>
  axiosInstance
    .get<SearchMessages>(
      `https://discord.com/api/v9/guilds/${guildId}/messages/search`,
      {
        params: {
          author_id: authorId,
          channel_id: channelId,
          offset,
        },
      }
    )
    .then((res) => res.data.messages.map((wrapper) => wrapper[0]));

const MESSAGE_CACHE: Record<APIMessage["id"], APIMessage> = {};

export const getMessageById = (
  channelId: string,
  messageId?: string
): Promise<APIMessage | undefined> => {
  if (messageId && MESSAGE_CACHE[messageId]) {
    return Promise.resolve(MESSAGE_CACHE[messageId]);
  }

  return axiosInstance
    .get<APIMessage[]>(
      `https://discord.com/api/v9/channels/${channelId}/messages`,
      { params: { limit: 1, around: messageId } }
    )
    .then((res) => res.data[0]);
};
