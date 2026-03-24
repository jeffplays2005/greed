import type { BaseCommandConfig, BaseCommandProps } from "src/types/command"
import { createSimpleEmbed } from "src/utils/embeds"

export const run = async ({ bot, message, color }: BaseCommandProps) => {
  const sent = await message.reply({
    embeds: [createSimpleEmbed("pinging...", color)],
    allowedMentions: {},
  })

  const latency = sent.createdTimestamp - message.createdTimestamp
  const apiLatency = Math.round(bot.ws.ping)

  await sent.edit({
    embeds: [
      createSimpleEmbed(`bot latency: \`${latency}\`\napi latency: \`${apiLatency}\``, color),
    ],
  })
}

export const config: BaseCommandConfig = {
  name: "ping",
  description: "checks bot latency and returns in miliseconds. ",
  usage: ["ping"],
  aliases: ["latency"],
  cooldown: 5,
}
