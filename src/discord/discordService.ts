import { APIMessage, MessageType, SearchFun, SearchMeta } from "../types.js";
import {
  getMessageById,
  searchMessagesFromAuthor,
  searchMessagesFromChannel,
} from "./discordApi.js";

const searchUntil = (
  findIndex: (messages: APIMessage[]) => number,
  searchFun: SearchFun,
  acumulatedMessages: APIMessage[] = [],
  offset: number = 0
): Promise<APIMessage[]> =>
  searchFun(offset).then((res) => {
    const lastMessageIndex = findIndex(res);

    if (lastMessageIndex === -1) {
      return searchUntil(
        findIndex,
        searchFun,
        [...acumulatedMessages, ...res],
        offset + 25
      );
    } else {
      const slicedMessages = res.slice(0, lastMessageIndex);

      return [...acumulatedMessages, ...slicedMessages];
    }
  });

export const searchMessagesAfterTimestamp = (
  timestamp: number,
  searchFun: SearchFun
): Promise<APIMessage[]> =>
  searchUntil(
    (messages) =>
      messages.findIndex(
        (message) => +new Date(message.timestamp) <= timestamp
      ),
    searchFun
  );

export const getMessageReference = (
  message: APIMessage
): Promise<APIMessage | null | undefined> => {
  if (!message.message_reference) {
    return Promise.resolve(undefined);
  }

  return getMessageById(
    message.message_reference.channel_id,
    message.message_reference.message_id
  );
};

export const getMessagesWithReferences = (
  message: APIMessage
): Promise<APIMessage> => {
  if (message.type !== MessageType.Reply) {
    return Promise.resolve(message);
  }

  return getMessageReference(message)
    .then((res) => {
      if (res) {
        return getMessagesWithReferences(res);
      }

      return res;
    })
    .then((ref) => ({ ...message, referenced_message: ref }));
};

const SEARCH_META: Record<string, SearchMeta> = {
  garyVee: {
    introMessage: "Gary Vee",
    searchFun: (offset) => searchMessagesFromAuthor({ offset }),
  },
  announcements: {
    introMessage: "Announcements",
    searchFun: (offset) => searchMessagesFromChannel({ offset }),
  },
};

export const getMetaForLinks = (
  links: Record<string, string>
): Promise<(SearchMeta & { key: string; link: string })[]> =>
  Promise.resolve(
    Object.entries(links)
      .filter(([key]) => Boolean(SEARCH_META[key]))
      .map(([key, link]) => ({ ...SEARCH_META[key], key, link }))
  );
