import type { Client } from "@/types/Client"
import { createSimpleEmbed } from "@/utils/embeds"

const ReadyEvent = (bot: Client) => {
  console.log(`Ready! Logged in as ${bot.user?.tag}`)

  bot.user?.setPresence({
    status: "dnd",
    activities: [{ name: "/xo" }],
  })

  setInterval(() => {
    bot.user?.setPresence({
      status: "dnd",
      activities: [{ name: "/xo" }],
    })
  }, 60_000)

  setInterval(async () => {
    const servers = await bot.db.servers.getServersToBump()
    for (const server of servers) {
      // Delete the nextBump field from the server so the reminder doesn't keep getting triggered
      await bot.db.servers.updateServerById(server.id, {
        bumpInfo: { ...server.bumpInfo, nextBump: null },
      })

      const bumpChannelId = server.notificationSettings?.bumpChannel
      if (!bumpChannelId) continue

      try {
        const channel = await bot.channels.fetch(bumpChannelId)
        if (!channel?.isSendable()) continue

        await channel.send({
          embeds: [
            createSimpleEmbed(
              `<:y_folderXODONTSTEAL:868918785367748678> ; the server is ready to be bumped! ${bot.config.interactions.external.bump}`,
              bot.config.defaultHexColor,
            ),
          ],
        })
      } catch (error) {
        console.error(
          `[ERROR] Failed to send bump reminder for server "${server.serverId}" to channel "${bumpChannelId}"`,
          error,
        )
      }
    }
  }, 60_000)
}

export default ReadyEvent
