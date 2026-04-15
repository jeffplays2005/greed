import type { User } from "discord.js"
import type { GetUserOptions } from "./types"

/**
 * Gets a user from the Discord cache or message mentions.
 *
 * @param options.message The message object to extract mentions from
 * @param options.bot The Discord client for accessing the user cache
 * @param options.toFind The user ID or tag to search for (defaults to empty string)
 * @param options.excludeSelf When true, returns undefined if no user is found. When false, falls back to the message author.
 * @returns The found user. If excludeSelf is false and no user is found, returns the message author. If excludeSelf is true and no user is found, returns undefined.
 */
export function getUser(options: GetUserOptions<true>): Promise<User | undefined>
export function getUser(options: GetUserOptions<false>): Promise<User>
export async function getUser({
  message,
  bot,
  toFind = "",
  excludeSelf,
}: GetUserOptions<boolean>): Promise<User | undefined> {
  toFind = toFind.toLowerCase()

  let target = bot.users.cache.get(toFind)

  if (!target && message.mentions.users) target = message.mentions.users.first()

  if (!target) {
    await bot.users.fetch(toFind).catch(() => null)
    target = bot.users.cache.get(toFind)
  }

  if (!target && !excludeSelf) target = message.author

  return target
}
