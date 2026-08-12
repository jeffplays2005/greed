import type { Message, MessageCreateOptions } from "discord.js"
import type { db } from "@/database"

export const sendModerationLog = async (
  message: Message<true>,
  database: typeof db,
  options: MessageCreateOptions,
): Promise<string | null> => {
  const server = await database.servers.getOrCreateServerByDiscordId(message.guild.id)
  const channelId = server.notificationSettings?.moderationChannel
  if (!channelId) return null

  const channel = message.guild.channels.cache.get(channelId)
  if (!channel?.isSendable()) return null

  const sent = await channel
    .send(options)
    .then(() => true)
    .catch(() => false)

  return sent ? channel.id : null
}
