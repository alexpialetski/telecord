import { APIMessage, MessageType } from "./types.js";
import { searchMessages, getMessageById } from "./discordApi.js";

const searchUntil = (
  findIndex: (messages: APIMessage[]) => number,
  acumulatedMessages: APIMessage[] = [],
  offset: number = 0
): Promise<APIMessage[]> =>
  searchMessages({ offset }).then((res) => {
    const lastMessageIndex = findIndex(res);

    if (lastMessageIndex === -1) {
      return searchUntil(
        findIndex,
        [...acumulatedMessages, ...res],
        offset + 25
      );
    } else {
      const slicedMessages = res.slice(0, lastMessageIndex);

      return [...acumulatedMessages, ...slicedMessages];
    }
  });

export const searchMessagesAfterTimestamp = (
  timestamp: number
): Promise<APIMessage[]> =>
  searchUntil((messages) =>
    messages.findIndex((message) => +new Date(message.timestamp) <= timestamp)
  );

export const getMessageReference = (
  message: APIMessage
): Promise<APIMessage | null | undefined> =>
  getMessageById(
    message.message_reference?.channel_id,
    message.message_reference?.message_id
  );

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
