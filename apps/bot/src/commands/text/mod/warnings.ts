import { EmbedBuilder } from "discord.js"
import ms, { type StringValue } from "ms"
import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"
import { getMember } from "@/utils/parsers"

const WARNINGS_PER_PAGE = 9

export const run = async ({ bot, message, args, db, color, prefix }: BaseCommandProps<true>) => {
  const target = getMember({ message, toFind: args[0], excludeSelf: true, excludeNameSearch: true })
  if (target?.user.bot)
    return message.reply({
      embeds: [createSimpleEmbed("bots don't have warnings!", color)],
      allowedMentions: { repliedUser: false },
    })

  const flagArgs = target ? args.slice(1) : args
  let pageNumber = 1
  let pageWasSet = false
  let olderThan: number | null = null
  let newerThan: number | null = null
  let finalOnly = false

  for (let index = 0; index < flagArgs.length; index++) {
    const argument = flagArgs[index]

    if (["--help", "--h"].includes(argument)) {
      const helpEmbed = new EmbedBuilder()
        .setTitle("help: warnings")
        .setDescription("shows warning history for this server or a specific member.")
        .addFields(
          {
            name: "warning commands",
            value: `\`${prefix}warn <user> <reason>\` - warn a member\n\`${prefix}cwarn <user>\` - clear a member's warnings\n\`${prefix}fwarn <user> <reason>\` - give a final warning`,
          },
          {
            name: "formatting",
            value: `\`${prefix}warnings <page>\` - show all warnings\n\`${prefix}warnings <user> <page>\` - show a member's warnings`,
          },
          {
            name: "filters",
            value:
              "`--time < 24h` - warnings newer than 24 hours\n`--time > 7d` - warnings older than 7 days\n`--final` - final warnings only",
          },
        )
        .setColor(color)

      return message.reply({ embeds: [helpEmbed], allowedMentions: { repliedUser: false } })
    }

    if (["--time", "--t"].includes(argument)) {
      const operator = flagArgs[index + 1]
      const durationInput = flagArgs[index + 2]
      const duration = durationInput ? ms(durationInput as StringValue) : undefined

      if (!duration || !["<", ">"].includes(operator)) {
        return message.reply({
          embeds: [
            createSimpleEmbed(
              "invalid time filter. use `--time < 24h` for newer warnings or `--time > 7d` for older warnings.",
              color,
            ),
          ],
          allowedMentions: { repliedUser: false },
        })
      }

      if (operator === ">") olderThan = Date.now() - duration
      if (operator === "<") newerThan = Date.now() - duration
      index += 2
      continue
    }

    if (argument === "--final") {
      finalOnly = true
      continue
    }

    if (/^\d+$/.test(argument) && !pageWasSet) {
      pageNumber = Number(argument)
      pageWasSet = true
    }
  }

  if (pageNumber < 1) {
    return message.reply({
      embeds: [createSimpleEmbed("page numbers must be greater than zero!", color)],
      allowedMentions: { repliedUser: false },
    })
  }

  const warnings = await db.warns.getServerWarns(message.guild.id, target?.id, {
    olderThan: olderThan ?? undefined,
    newerThan: newerThan ?? undefined,
    final: finalOnly,
  })

  if (warnings.length === 0) {
    return message.reply({
      embeds: [
        createSimpleEmbed(
          target
            ? `${target} has no warnings matching this search!`
            : "no warnings matched this search!",
          color,
        ),
      ],
      allowedMentions: { repliedUser: false },
    })
  }

  const pageCount = Math.ceil(warnings.length / WARNINGS_PER_PAGE)
  if (pageNumber > pageCount) {
    return message.reply({
      embeds: [createSimpleEmbed("there are no warnings on this page!", color)],
      allowedMentions: { repliedUser: false },
    })
  }

  const pageStart = (pageNumber - 1) * WARNINGS_PER_PAGE
  const page = warnings.slice(pageStart, pageStart + WARNINGS_PER_PAGE)
  const warningsEmbed = new EmbedBuilder()
    .setTitle(target ? `${target.user.tag}'s warnings` : `${message.guild.name}'s warnings`)
    .setColor(color)
    .setFooter({
      text: `showing ${pageStart + 1}-${pageStart + page.length} of ${warnings.length} warnings (page ${pageNumber}/${pageCount})`,
    })

  if (target && warnings.some((warning) => warning.final)) {
    warningsEmbed.setDescription("this member is on their final warning.")
  }

  for (const warning of page) {
    const timestamp = Math.floor(new Date(warning.createdAt).getTime() / 1000)
    const reason = (warning.reason || "no reason provided").slice(0, 850)

    warningsEmbed.addFields({
      name: `${warning.final ? bot.config.emojis.final_warning : bot.config.emojis.warning} warning ${warning.id}${warning.final ? " - final" : ""}`,
      value: `<@${warning.to}> - *${reason}*\n<t:${timestamp}>`,
      inline: true,
    })
  }

  return message.reply({
    embeds: [warningsEmbed],
    allowedMentions: { repliedUser: false },
  })
}

export const config: BaseCommandConfig = {
  name: "warnings",
  description: "shows warning history for the server or a member",
  usage: ["warnings <page>", "warnings <user> <page> [--time <|> duration] [--final]"],
  aliases: ["warns"],
  cooldown: 1,
  permissionSet: {
    guildOnly: true,
    userPermissionsRequired: ["ManageMessages"],
  },
}
