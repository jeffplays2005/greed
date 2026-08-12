import { EmbedBuilder } from "discord.js"
import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"
import { sendModerationLog } from "@/utils/moderation"
import { getMember } from "@/utils/parsers"

export const run = async ({ bot, message, args, db, color }: BaseCommandProps<true>) => {
  const member = getMember({ message, toFind: args[0], excludeSelf: true })
  if (!member)
    return message.reply({
      embeds: [createSimpleEmbed("you must mention a user to clear their warnings!", color)],
      allowedMentions: { repliedUser: false },
    })

  const warnings = await db.warns.getServerWarns(message.guild.id, member.id)

  if (!warnings.length)
    return message.reply({
      embeds: [createSimpleEmbed(`${member} has no warnings to clear!`, color)],
      allowedMentions: { repliedUser: false },
    })

  const clearedWarnings = await db.warns.clearUserWarns(message.guild.id, member.id)

  const clearedEmbed = new EmbedBuilder()
    .setTitle("warns cleared")
    .setDescription(
      `${bot.config.emojis.placeholder} cleared ${clearedWarnings.docs.length} warning${clearedWarnings.docs.length === 1 ? "" : "s"} for ${member}.`,
    )
    .setColor(color)
    .setTimestamp()

  const clearedSummary = clearedWarnings.docs
    .map((warning) => `${warning.id} | ${warning.reason || "no reason provided"}`)
    .join("\n")
    .slice(0, 1024)

  const logChannelId = await sendModerationLog(message, db, {
    embeds: [
      EmbedBuilder.from(clearedEmbed)
        .setFooter({ text: `cleared by: ${message.author.tag} (${message.author.id})` })
        .addFields({ name: "warnings cleared", value: clearedSummary }),
    ],
    allowedMentions: {},
  })

  if (message.channel.id !== logChannelId) {
    return message.channel.send({
      embeds: [clearedEmbed],
      allowedMentions: {},
    })
  }
}

export const config: BaseCommandConfig = {
  name: "clearwarn",
  description: "clears all warnings for a member",
  usage: ["clearwarn <user>"],
  aliases: ["clearwarns", "cwarn", "cwarns"],
  cooldown: 1,
  permissionSet: {
    guildOnly: true,
    userPermissionsRequired: ["ManageMessages"],
  },
}
