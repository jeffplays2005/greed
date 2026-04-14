import type { GuildMember } from "discord.js"
import type { GetMemberOptions } from "./types"

/**
 * Gets a guild member from message mentions, cache, or display name/tag search.
 *
 * @param options.message The message object to extract mentions and guild context from
 * @param options.toFind The member ID, display name, or tag to search for (defaults to empty string)
 * @param options.excludeSelf When true, does not fall back to the message author. When false, falls back to the message member if no match is found.
 * @returns The found guild member, or undefined if not found or if the message is not in a guild.
 */
export function getMember(options: GetMemberOptions<true>): GuildMember | undefined
export function getMember(options: GetMemberOptions<false>): GuildMember | undefined
export function getMember({
  message,
  toFind = "",
  excludeSelf = true,
}: GetMemberOptions<boolean>): GuildMember | undefined {
  const lowercaseFind = toFind.toLowerCase()

  if (!message.guild) return undefined

  let target: GuildMember | undefined = message.guild?.members.cache.get(lowercaseFind)

  if (!target && message.mentions.members) target = message.mentions.members.first()

  if (!target && lowercaseFind) {
    target = message.guild.members.cache.find((member) => {
      return (
        member.displayName.toLowerCase().includes(lowercaseFind) ||
        member.user.tag.toLowerCase().includes(lowercaseFind)
      )
    })
  }

  if (!target && !excludeSelf) target = message.member ?? undefined

  return target
}
