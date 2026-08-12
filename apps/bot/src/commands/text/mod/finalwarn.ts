import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"
import { sendModerationLog } from "@/utils/moderation"
import { getMember } from "@/utils/parsers"

export const run = async ({ bot, message, args, db, color, prefix }: BaseCommandProps<true>) => {
  const member = getMember({ message, toFind: args[0], excludeSelf: true })
  if (!member || member.user.bot)
    return message.reply({
      embeds: [createSimpleEmbed("you must mention a valid member to final warn!", color)],
      allowedMentions: { repliedUser: false },
    })

  const reason = args.slice(1).join(" ").trim()
  if (!reason)
    return message.reply({
      embeds: [
        createSimpleEmbed(
          `you must provide a reason! e.g. ${prefix}finalwarn <user> <reason>`,
          color,
        ),
      ],
      allowedMentions: { repliedUser: false },
    })

  if (await db.warns.hasFinalWarn(message.guild.id, member.id)) {
    return message.reply({
      embeds: [createSimpleEmbed(`${member} is already on their final warning!`, color)],
      allowedMentions: { repliedUser: false },
    })
  }

  const warning = await db.warns.createWarn({
    reason,
    by: message.author.id,
    to: member.id,
    server: message.guild.id,
    final: true,
  })
  const warningCount = (await db.warns.getServerWarns(message.guild.id, member.id)).length

  await message.delete().catch(() => {})

  const warningEmbed = new EmbedBuilder()
    .setTitle(`${bot.config.emojis.final_warning} final warning`)
    .setDescription(
      `${bot.config.emojis.placeholder} ${member} **has been warned:** "${reason}"
      **this is your final warning!** further breaking of rules **will** result in a ban.`,
    )
    .setFooter({
      text: `${member.user.tag} has ${warningCount} warning${warningCount === 1 ? "" : "s"} (warning id: ${warning.id})`,
    })
    .setColor(color)
    .setTimestamp()

  let failedToDm = false
  await member
    .send({
      embeds: [warningEmbed],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary)
            .setLabel(`sent from ${message.guild.name}`.slice(0, 80))
            .setCustomId("warning_source"),
        ),
      ],
      allowedMentions: {},
    })
    .catch(() => {
      failedToDm = true
    })

  if (failedToDm) {
    warningEmbed.setFooter({
      text: `${member.user.tag} has ${warningCount} warning${warningCount === 1 ? "" : "s"} (warning id: ${warning.id}) | failed to dm`,
    })
  }

  const logChannelId = await sendModerationLog(message, db, {
    embeds: [
      EmbedBuilder.from(warningEmbed).addFields({ name: "warned by", value: `${message.author}` }),
    ],
    allowedMentions: {},
  })

  if (message.channel.id !== logChannelId) {
    return message.channel.send({
      embeds: [warningEmbed],
      allowedMentions: {},
    })
  }
}

export const config: BaseCommandConfig = {
  name: "finalwarn",
  description: "gives a member their final warning",
  usage: ["finalwarn <user> <reason>"],
  aliases: ["fwarn"],
  cooldown: 1,
  permissionSet: {
    guildOnly: true,
    userPermissionsRequired: ["ManageMessages"],
  },
}
