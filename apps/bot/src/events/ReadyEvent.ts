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
    servers.forEach(async (server) => {
      delete server.bumpInfo?.nextBump

      // Delete the nextBump field from the server so the reminder doesn't keep getting triggered
      await bot.db.servers.updateServerById(server.id, {
        bumpInfo: { ...server.bumpInfo, nextBump: null },
      })

      if (server.serverId === bot.config.servers.support[0]) {
        const channel = bot.channels.cache.get(bot.config.channels.xo.general)
        if (channel?.isSendable()) {
          channel.send({
            embeds: [
              createSimpleEmbed(
                `<:y_folderXODONTSTEAL:868918785367748678> ; the server is ready to be bumped! ${bot.config.interactions.external.bump}`,
                bot.config.defaultHexColor,
              ),
            ],
          })
        }
      }
    })
  }, 60_000)
}

export default ReadyEvent
