import { EmbedBuilder } from "discord.js"
import { CacheCollectionKeys } from "../../../types/Collection"
import { InternalPermissions } from "../../../types/Config"
import type { BaseCommandConfig, BaseCommandProps } from "../../../types/command"
import { createSimpleEmbed } from "../../../utils/embeds"

enum CommandAction {
  Disable = "disable",
  Enable = "enable",
  List = "list",
}

export const run = async ({ message, args, bot, db, color, prefix }: BaseCommandProps) => {
  const subCommand = args[0]?.toLowerCase()

  if (subCommand === CommandAction.Disable) {
    const commandToDisable = args[1]?.toLowerCase()
    if (!commandToDisable) {
      await message.reply({
        embeds: [createSimpleEmbed("please provide a command name to disable.", color)],
        allowedMentions: {},
      })
      return
    }

    const commandToFind = bot.commands.get(commandToDisable)

    if (!commandToFind || commandToFind.config.name === "command") {
      await message.reply({
        embeds: [createSimpleEmbed(`command \`${commandToDisable}\` not found.`, color)],
        allowedMentions: {},
      })
      return
    }

    if (await db.botConfig.isCommandDisabled(commandToFind.config.name)) {
      await message.reply({
        embeds: [
          createSimpleEmbed(`command \`${commandToFind.config.name}\` is already disabled.`, color),
        ],
        allowedMentions: {},
      })
      return
    }
    const { disabledCommands } = await db.botConfig.addDisabledCommand(commandToDisable)
    bot.cache.set(CacheCollectionKeys.GLOBAL_DISABLED_COMMANDS, disabledCommands)

    await message.reply({
      embeds: [
        createSimpleEmbed(`command \`${commandToDisable}\` has been disabled globally.`, color),
      ],
      allowedMentions: {},
    })
  } else if (subCommand === CommandAction.Enable) {
    const commandToEnable = args[1]?.toLowerCase()
    if (!commandToEnable) {
      return message.reply({
        embeds: [createSimpleEmbed("no command specified to enable.", color)],
        allowedMentions: {},
      })
    }

    if (!(await db.botConfig.isCommandDisabled(commandToEnable))) {
      return message.reply({
        embeds: [createSimpleEmbed(`command \`${commandToEnable}\` is not disabled.`, color)],
        allowedMentions: {},
      })
    }
    const { disabledCommands } = await db.botConfig.removeDisabledCommand(commandToEnable)
    bot.cache.set(CacheCollectionKeys.GLOBAL_DISABLED_COMMANDS, disabledCommands)

    await message.reply({
      embeds: [
        createSimpleEmbed(`command \`${commandToEnable}\` has been enabled globally.`, color),
      ],
      allowedMentions: {},
    })
  } else if (subCommand === CommandAction.List) {
    const disabledCommands = bot.cache.get(CacheCollectionKeys.GLOBAL_DISABLED_COMMANDS) as
      | Set<string>
      | undefined
    const list = disabledCommands?.size
      ? Array.from(disabledCommands).sort((a, b) => a.localeCompare(b))
      : []

    await message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("disabled commands")
          .setDescription(`${list.map((cmd) => `\`${cmd}\``).join(" ") || "no disabled commands"}`)
          .setColor(color),
      ],
      allowedMentions: {},
    })
  } else {
    await message.reply({
      embeds: [
        createSimpleEmbed(`i dont know what u want: \`${prefix}help ${config.name}\`.`, color),
      ],
      allowedMentions: {},
    })
  }
}

export const config: BaseCommandConfig = {
  name: "command",
  description: "enable or disable commands globally",
  aliases: [],
  usage: ["command disable <command>", "command enable <command>", "command list", "command help"],
  permissionSet: {
    internalPermissions: [InternalPermissions.OWNERS],
  },
}
