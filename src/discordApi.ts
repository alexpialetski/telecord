import axios from "axios";

import { APIMessage, SearchMessages } from "./types.js";
import { GARY_VEE_ID, VEEFRIENDS_GUILD } from "./constant.js";
import { waitFor } from "./utils.js";

const axiosInstance = axios.create({
  headers: {
    Authorization: process.env.DISCORD_AUTH_TOKEN || "",
  },
});

type SearchMessagesParams = {
  offset?: number;
  guildId?: string;
  authorId?: string;
  channel_id?: string;
};

export const searchMessages = ({
  offset,
  guildId = VEEFRIENDS_GUILD,
  authorId = GARY_VEE_ID,
}: SearchMessagesParams = {}): Promise<APIMessage[]> =>
  axiosInstance
    .get<SearchMessages>(
      `https://discord.com/api/v9/guilds/${guildId}/messages/search`,
      {
        params: {
          author_id: authorId,
          offset,
        },
      }
    )
    .then((res) => res.data.messages.map((wrapper) => wrapper[0]))
    .then(waitFor(200));

export const getMessageById = (
  channelId?: string,
  messageId?: string
): Promise<APIMessage | undefined> =>
  axiosInstance
    .get<APIMessage[]>(
      `https://discord.com/api/v9/channels/${channelId}/messages`,
      { params: { limit: 1, around: messageId } }
    )
    .then((res) => res.data[0])
    .then(waitFor(200));
