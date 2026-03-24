import type { Message } from "discord.js"
import type { Client } from "src/types/Client"
import type { BaseCommandConfig } from "src/types/command"
import { checkBotPermissions, checkMemberPermissions } from "./helpers"

/**
 * Validates all permission constraints for a command
 *
 * @param bot The base client
 * @param message The message that was sent to call this permission validation
 * @param config The command's base config
 * @returns An object with `valid` boolean and `error` string
 */
export function validatePermissions(
  bot: Client,
  message: Message,
  config: BaseCommandConfig,
): { valid: boolean; error?: string } {
  // Disabled commands cannot be executed
  if (config.disabled) {
    return { valid: false, error: "this command is disabled!" }
  }

  // Dev-only takes precedence over all other restrictions
  if (config.dev) {
    const devIds = bot.config.users.dev ?? []
    if (!devIds.includes(message.author.id))
      return { valid: false, error: "this command is dev only!" }
    return { valid: true, error: "this command is dev only!" }
  }

  const permSet = config.permissionSet

  // Check location constraints (guild / dm only)
  if (permSet?.guildOnly && !message.inGuild()) {
    return { valid: false, error: "this command can only be used in servers!" }
  }
  if (permSet?.dmsOnly && message.inGuild()) {
    return { valid: false, error: "this command can only be used in direct messages!" }
  }

  // Check support server constraints
  const supportServerIds = bot.config.servers.support ?? []
  const inSupportServer = message.guildId ? supportServerIds.includes(message.guildId) : false
  if (permSet?.supportOnly && !inSupportServer) {
    return {
      valid: false,
      error: "this command is only available in the support server!",
    }
  }
  if (permSet?.supportDisabled && inSupportServer) {
    return { valid: false, error: "this command is disabled in the support server!" }
  }

  // Check user permissions
  if (!checkMemberPermissions(message, permSet?.userPermissionsRequired)) {
    return {
      valid: false,
      error: "you don't have the required permissions to use this command!",
    }
  }

  // Check bot permissions
  if (!checkBotPermissions(message, permSet?.requiredPermissions)) {
    return {
      valid: false,
      error: "i don't have the required permissions to execute this command!",
    }
  }

  return { valid: true }
}
