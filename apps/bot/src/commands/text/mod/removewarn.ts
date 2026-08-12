import { EmbedBuilder } from "discord.js"
import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"
import { sendModerationLog } from "@/utils/moderation"

export const run = async ({ bot, message, args, db, color }: BaseCommandProps<true>) => {
  const warningId = args[0]?.trim()
  if (!warningId) {
    return message.reply({
      embeds: [createSimpleEmbed("you must provide a warning id to remove!", color)],
      allowedMentions: { repliedUser: false },
    })
  }

  const warning = await db.warns.removeServerWarn(message.guild.id, warningId)
  if (!warning) {
    return message.reply({
      embeds: [createSimpleEmbed(`warning \`${warningId}\` could not be found!`, color)],
      allowedMentions: { repliedUser: false },
    })
  }

  const removedEmbed = new EmbedBuilder()
    .setTitle("warning removed")
    .setDescription(
      `${bot.config.emojis.placeholder} removed ${warning.final ? "final " : ""}warning \`${warning.id}\` from <@${warning.to}>.`,
    )
    .addFields({
      name: "reason",
      value: (warning.reason || "no reason provided").slice(0, 1024),
    })
    .setColor(color)
    .setTimestamp()

  const logChannelId = await sendModerationLog(message, db, {
    embeds: [
      EmbedBuilder.from(removedEmbed).setFooter({
        text: `removed by: ${message.author.tag} (${message.author.id})`,
      }),
    ],
    allowedMentions: {},
  })

  if (message.channel.id !== logChannelId) {
    return message.channel.send({
      embeds: [removedEmbed],
      allowedMentions: {},
    })
  }
}

export const config: BaseCommandConfig = {
  name: "removewarn",
  description: "removes a warning by its id",
  usage: ["removewarn <warning id>"],
  aliases: ["deletewarn", "delwarn", "rwarn"],
  cooldown: 1,
  permissionSet: {
    guildOnly: true,
    userPermissionsRequired: ["ManageMessages"],
  },
}
