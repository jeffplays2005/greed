import type { Message, PermissionResolvable } from "discord.js"
import type { Client } from "@/types/Client"
import { InternalPermissions } from "@/types/Config"

/**
 * Checks if the bot has all required permissions
 *
 * @param message The message that was sent requesting this permission check
 * @param requiredPermissions The permissions list to check
 * @returns A boolean value if the permissions are met
 */
export function checkBotPermissions(
  message: Message,
  requiredPermissions?: PermissionResolvable[],
): boolean {
  if (!requiredPermissions?.length) {
    return true
  }

  if (!message.inGuild()) {
    return true
  }

  const botMember = message.guild?.members.me
  if (!botMember) {
    return false
  }

  return requiredPermissions.every((perm) => {
    return botMember.permissions.has(perm)
  })
}

/**
 * Checks if a member has all required permissions
 *
 * @param message The message that was sent requesting this permission check
 * @param requiredPermissions The permissions list to check
 * @returns A boolean value if the permissions are met
 */
export function checkMemberPermissions(
  message: Message,
  requiredPermissions?: PermissionResolvable[],
): boolean {
  if (!requiredPermissions?.length) {
    return true
  }

  if (!message.inGuild() || !message.member) {
    return false
  }

  const member = message.member
  return requiredPermissions.every((perm) => {
    return member.permissions.has(perm)
  })
}

/**
 * Checks if the user has all required internal permissions
 *
 * @param message The message that was sent requesting this permission check
 * @param internalPermissions The internal permissions list to check
 * @param bot The client instance
 * @returns A boolean value if the permissions are met
 */
export function checkInternalPermissions(
  message: Message,
  internalPermissions?: InternalPermissions[],
  bot?: Client,
): boolean {
  if (!internalPermissions?.length || !bot) {
    return true
  }

  return internalPermissions.every((perm) => {
    switch (perm) {
      case InternalPermissions.OWNERS:
        return (bot.config.users.owners ?? []).includes(message.author.id)
      default:
        return false
    }
  })
}
