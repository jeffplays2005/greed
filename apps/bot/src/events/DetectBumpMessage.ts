import type { Message } from "discord.js"
import type { Client } from "@/types/Client"

const DetectBumpMessage = async (message: Message, bot: Client) => {
  if (!message.guild || message.author.id !== bot.config.users.disboard || !message.embeds) return

  // Check embed contents
  if (!message.embeds[0].description?.includes("Bump done!")) return

  const now = new Date()
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000)

  await bot.db.servers.getOrCreateServerByDiscordId(message.guild.id)
  await bot.db.servers.updateServerById(message.guild.id, {
    bumpInfo: { bumpedAt: now.toUTCString(), nextBump: twoHoursLater.toUTCString() },
  })
}

export default DetectBumpMessage
