import type { ColorResolvable, Message } from "discord.js"
import type { Client } from "@/types/Client"
import { createSimpleEmbed } from "@/utils/embeds"
import { validatePermissions } from "@/utils/security"

/**
 * Handles message events and parses/executes text commands
 */
async function MessageEvent(message: Message, bot: Client) {
  if (message.author.bot) return

  const prefix = process.env.NODE_ENV === "development" ? bot.config.devPrefix : bot.config.prefix
  const color = bot.config.defaultHexColor as ColorResolvable

  // Only process messages with the prefix
  if (!message.content.startsWith(prefix)) return

  // Parse command name and arguments
  const args = message.content.slice(prefix.length).trim().split(/\s+/)
  const commandName = args.shift()?.toLowerCase()
  if (!commandName) return

  // Resolve command from collection or aliases
  let command = bot.commands.get(commandName)

  if (!command) {
    const aliasedName = bot.aliases.get(commandName)
    if (aliasedName) {
      command = bot.commands.get(aliasedName)
    }
  }

  if (!command) return

  const config = command.config

  // Validate permissions before executing
  const validation = validatePermissions(bot, message, config)
  if (!validation.valid) {
    await message
      .reply({
        embeds: [createSimpleEmbed(validation.error ?? "you cannot use this command!", color)],
        allowedMentions: { repliedUser: false },
      })
      .catch(() => {})
    return
  }

  try {
    // Check for cooldowns
    const cd = bot.cooldownManager.isOnCooldown(message.author.id, config.name)
    if (cd)
      return message.reply({
        embeds: [createSimpleEmbed(`you are on cooldown for ${Math.round(cd / 1000)}s.`, color)],
        allowedMentions: { repliedUser: false },
      })
    bot.cooldownManager.setCooldown(message.author.id, config.name, config.cooldown)

    await command.run({
      message,
      bot,
      command: commandName,
      args,
      db: bot.db,
      prefix,
      color,
      payload: bot.payload,
    })
  } catch (error) {
    console.error(`[ERROR] Command "${config.name}" execution failed:`, error)
    await message
      .reply({
        embeds: [createSimpleEmbed("an error occurred while executing this command.", color)],
        allowedMentions: { repliedUser: false },
      })
      .catch(() => {})
  }
}

export default MessageEvent
