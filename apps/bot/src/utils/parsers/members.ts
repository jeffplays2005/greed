import type { GuildMember } from "discord.js"
import type { GetMemberOptions } from "./types"

/**
 * Helper function to get a member from either message mentions or display name / tag.
 *
 * @returns The found member, or undefined if not found
 */
export const getMember = ({
  message,
  toFind = "",
  excludeSelf = true,
}: GetMemberOptions): GuildMember | undefined => {
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
