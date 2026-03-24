import type { ColorResolvable, Message } from "discord.js"
import type { Client } from "src/types/Client"
import { createSimpleEmbed } from "src/utils/embeds"
import { validatePermissions } from "src/utils/security"

/**
 * Handles message events and parses/executes text commands
 */
async function MessageEvent(message: Message, bot: Client): Promise<void> {
  if (message.author.bot) return

  const prefix = bot.config.prefix
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
    await command.run({
      message,
      bot,
      args,
      db: undefined,
      prefix,
      color,
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
