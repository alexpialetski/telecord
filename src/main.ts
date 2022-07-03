import {
  searchMessagesAfterTimestamp,
  getMessagesWithReferences,
  getMetaForLinks,
} from "./discord/discordService.js";
import { getMessageById } from "./discord/discordApi.js";
import { parseLink } from "./utils/utils.js";
import { APIMessage, Channel, SearchFun } from "./types.js";
import { sendTextMessage, TelegramBot } from "./telegram/telegramApi.js";
import {
  sendDiscordMessageThread,
  sendErrorMessage,
  sendHappyGif,
  sendSadGif,
} from "./telegram/telegramService.js";
import { TELEGRAM_CHANNEL_ID, VEEFRIENDS_GUILD } from "./constant.js";

const sendMessageQueue = (messages: APIMessage[], startMessageLink: string) =>
  messages
    .reduce<Promise<unknown>>(
      (acc, message, index) =>
        acc
          .then(() => getMessagesWithReferences(message))
          .then(sendDiscordMessageThread)
          .then((message) =>
            index + 1 !== messages.length
              ? sendTextMessage("🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩")
              : message
          ),
      Promise.resolve()
    )
    .then(() => {
      const lastMessage = messages.pop();

      const lastMessageLink = lastMessage
        ? `https://discord.com/channels/${VEEFRIENDS_GUILD}/${lastMessage?.channel_id}/${lastMessage?.id}`
        : startMessageLink;

      return {
        lastMessageLink,
        hasUpdated: startMessageLink !== lastMessageLink,
      };
    });

export const searchMessagesByLink = (link: string, searchFun: SearchFun) => {
  const { channelId, messageId } = parseLink(link);

  if (!messageId || !channelId) {
    throw new Error("Link is broken");
  }

  return getMessageById(channelId, messageId)
    .then((message) => {
      if (!message) {
        throw new Error(`Could not find that ${messageId} message`);
      }

      return searchMessagesAfterTimestamp(
        +new Date(message.timestamp),
        searchFun
      );
    })
    .then((res) => res.reverse());
};

type MessageThreadResult = { link: string; key: string; hasUpdated: boolean };

export const postByLinks = (
  links: Record<string, string>
): Promise<MessageThreadResult[]> =>
  getMetaForLinks(links).then<MessageThreadResult[]>((metaArray) =>
    metaArray.reduce(
      (searchChain, meta) =>
        searchChain.then((arrWithLinks) =>
          searchMessagesByLink(meta.link, meta.searchFun).then((messages) => {
            if (!messages.length) {
              return Promise.resolve([
                ...arrWithLinks,
                {
                  hasUpdated: false,
                  link: meta.link,
                  key: meta.key,
                },
              ]);
            }

            return sendTextMessage(
              `🟨🟨🟨🟨🟨🟨${meta.introMessage}🟨🟨🟨🟨🟨🟨`
            )
              .then(() => sendMessageQueue(messages, meta.link))
              .then((result) => [
                ...arrWithLinks,
                {
                  hasUpdated: result.hasUpdated,
                  link: result.lastMessageLink,
                  key: meta.key,
                },
              ]);
          })
        ),
      Promise.resolve([] as MessageThreadResult[])
    )
  );

export const handleLastMessageLinks =
  ({ save = true } = {}) =>
  (result: MessageThreadResult[]) => {
    if (!result.length || result.every((meta) => !meta.hasUpdated)) {
      return sendSadGif();
    }

    const formattedLinks = result.reduce<Record<string, string>>(
      (acc, meta) => ({
        ...acc,
        [meta.key]: meta.link,
      }),
      {}
    );

    return (
      save ? saveLastMessageLinks(formattedLinks) : Promise.resolve()
    ).then(sendHappyGif);
  };

export const getLastMessageLinks = (): Promise<Record<string, string>> =>
  TelegramBot.telegram
    .getChat(TELEGRAM_CHANNEL_ID)
    .then((res) => JSON.parse((res as Channel).description))
    .catch(() => sendErrorMessage("couldn't parse links").then(() => ({})));

export const saveLastMessageLinks = (
  links: Record<string, string>
): Promise<unknown> =>
  TelegramBot.telegram
    .setChatDescription(TELEGRAM_CHANNEL_ID, JSON.stringify(links))
    .catch(() =>
      sendErrorMessage(
        `save link into description manually: ${JSON.stringify(links)}`
      )
    );
