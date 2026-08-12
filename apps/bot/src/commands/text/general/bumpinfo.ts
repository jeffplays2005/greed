import { EmbedBuilder } from "discord.js"
import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"
import { milisecondsToDiscordFormat } from "@/utils/parsers"

export const run = async ({ bot, message, color, db, prefix }: BaseCommandProps<true>) => {
  const serverData = await db.servers.getOrCreateServerByDiscordId(message.guild.id)
  const { bumpInfo, notificationSettings } = serverData
  const bumpChannel = notificationSettings?.bumpChannel
    ? `<#${notificationSettings.bumpChannel}>`
    : `configure this using \`${prefix}settings\``

  if (!bumpInfo?.nextBump)
    return message.reply({
      embeds: [
        createSimpleEmbed(
          `no bump data yet, try bumping now using ${bot.config.interactions.external.bump}!`,
          color,
        ),
      ],
      allowedMentions: {},
    })

  const bumpInfoEmbed = new EmbedBuilder()
    .setTitle("bump info")
    .setDescription(
      `bumped at: ${milisecondsToDiscordFormat(new Date(bumpInfo.bumpedAt!).getTime())}
        next bump: ${milisecondsToDiscordFormat(new Date(bumpInfo.nextBump).getTime())}

        notification channel: ${bumpChannel}`,
    )
    .setColor(color)

  return message.reply({
    embeds: [bumpInfoEmbed],
    allowedMentions: {},
  })
}

export const config: BaseCommandConfig = {
  name: "bumpinfo",
  description: "displays recent bump information and next bump time.",
  usage: ["bumpinfo"],
  aliases: [],
  cooldown: 5,
  permissionSet: {
    guildOnly: true,
  },
}
