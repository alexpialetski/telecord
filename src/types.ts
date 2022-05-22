// https://github.com/discordjs/discord-api-types/blob/bc6e97f309b1f5e0bc0063ada3aed77f34214e9f/payloads/v9/user.ts#L11
export type APIUser = {
  id: string;
  username: string;
  discriminator: string; // The user's 4-digit discord-tag
};

// https://github.com/discordjs/discord-api-types/blob/bc6e97f309b1f5e0bc0063ada3aed77f34214e9f/payloads/v9/channel.ts#L1024
export interface APIAttachment {
  id: string;
  filename: string;
  content_type?: "image/jpeg" | "video/quicktime";
  size: number; // Size of file in bytes
  url: string;
  proxy_url: string;
}

// https://github.com/discordjs/discord-api-types/blob/bc6e97f309b1f5e0bc0063ada3aed77f34214e9f/payloads/v9/channel.ts#L852
export enum EmbedType {
  /**
   * Generic embed rendered from embed attributes
   */
  Rich = "rich",
  /**
   * Image embed
   */
  Image = "image",
  /**
   * Video embed
   */
  Video = "video",
  /**
   * Animated gif image embed rendered as a video embed
   */
  GIFV = "gifv",
  /**
   * Article embed
   */
  Article = "article",
  /**
   * Link embed
   */
  Link = "link",
}

// https://github.com/discordjs/discord-api-types/blob/bc6e97f309b1f5e0bc0063ada3aed77f34214e9f/payloads/v9/channel.ts#L769
export interface APIEmbed {
  title?: string;
  /**
   * @deprecated *Embed types should be considered deprecated and might be removed in a future API version*
   */
  type?: EmbedType;
  description?: string;
  url?: string;
}

// https://github.com/discordjs/discord-api-types/blob/bc6e97f309b1f5e0bc0063ada3aed77f34214e9f/payloads/v9/channel.ts#L544
export interface APIMessageReference {
  message_id?: string;
  channel_id: string;
  guild_id?: string;
}

// https://github.com/discordjs/discord-api-types/blob/bc6e97f309b1f5e0bc0063ada3aed77f34214e9f/payloads/v9/channel.ts#L497
export enum MessageType {
  Default,
  RecipientAdd,
  RecipientRemove,
  Call,
  ChannelNameChange,
  ChannelIconChange,
  ChannelPinnedMessage,
  GuildMemberJoin,
  UserPremiumGuildSubscription,
  UserPremiumGuildSubscriptionTier1,
  UserPremiumGuildSubscriptionTier2,
  UserPremiumGuildSubscriptionTier3,
  ChannelFollowAdd,
  GuildDiscoveryDisqualified = 14,
  GuildDiscoveryRequalified,
  GuildDiscoveryGracePeriodInitialWarning,
  GuildDiscoveryGracePeriodFinalWarning,
  ThreadCreated,
  Reply,
  ChatInputCommand,
  ThreadStarterMessage,
  GuildInviteReminder,
  ContextMenuCommand,
}

// https://github.com/discordjs/discord-api-types/blob/bc6e97f309b1f5e0bc0063ada3aed77f34214e9f/payloads/v9/channel.ts#L305
export type APIMessage = {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: APIUser;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  mention_everyone: boolean;
  mentions: APIUser[];
  attachments: APIAttachment[];
  embeds: APIEmbed[];
  type: MessageType;
  message_reference?: APIMessageReference;
  referenced_message?: APIMessage | null;
};

export type SearchMessages = {
  total_results: number;
  messages: [APIMessage][];
  analytics_id: string;
};
