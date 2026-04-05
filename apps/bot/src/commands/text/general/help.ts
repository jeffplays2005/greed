import { EmbedBuilder } from "discord.js"
import { CacheCollectionKeys } from "@/types/Collection"
import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"

export const run = async ({ message, bot, color, args, prefix }: BaseCommandProps) => {
  const categoryMappings = bot.cache.get(CacheCollectionKeys.FOLDER_MAPPING) as Map<
    string,
    string[]
  >

  const helpEmbed = new EmbedBuilder()
    .setTitle("help")
    .setDescription(`for detailed usage, use \`${prefix}help <command>\``)
    .setColor(color)

  const sortedCategories = Array.from(categoryMappings.entries()).sort((a, b) =>
    a[0].toLowerCase().localeCompare(b[0].toLowerCase()),
  )

  for (const [category, commands] of sortedCategories) {
    const commandList = commands
      .filter((command) => !bot.commands.get(command)?.config.dev)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map((c) => `\`${c}\``)
      .join(" ")
    helpEmbed.addFields({
      name: category.toLowerCase(),
      value: commandList || "no commands",
      inline: false,
    })
  }

  const command = args[0]
  if (!command)
    return message.reply({
      embeds: [helpEmbed],
      allowedMentions: {},
    })

  // Specific command help
  const fetchedCmd = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command) ?? "")
  if (!fetchedCmd)
    return message.reply({
      embeds: [helpEmbed],
      allowedMentions: {},
    })

  const cmdEmbed = new EmbedBuilder()
    .setTitle(`command: \`${command}\``)
    .setDescription(fetchedCmd.config.description)
    .setColor(color)
    .addFields([
      {
        name: "usage:",
        value: fetchedCmd.config.usage.map((usage) => `\`${prefix}${usage}\``).join("\n"),
        inline: false,
      },
      {
        name: "aliases:",
        value: fetchedCmd.config.aliases?.map((alias) => `\`${alias}\``).join(", ") || "none",
        inline: false,
      },
      {
        name: "cooldown:",
        value: fetchedCmd.config.cooldown ? `${fetchedCmd.config.cooldown}s` : "none",
        inline: false,
      },
      {
        name: "server only:",
        value: fetchedCmd.config.permissionSet?.guildOnly ? "yes" : "no",
        inline: true,
      },
      {
        name: "dms only:",
        value: fetchedCmd.config.permissionSet?.dmsOnly ? "yes" : "no",
        inline: true,
      },
    ])

  return message.reply({
    embeds: [cmdEmbed],
    allowedMentions: {},
  })
}

export const config: BaseCommandConfig = {
  name: "help",
  description: "shows all commands or get more help with a particular command",
  usage: ["help", "help <command>"],
  cooldown: 0,
}
