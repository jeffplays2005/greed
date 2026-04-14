import type { GetUserOptions } from "./types"

export const getUser = ({ message, bot, toFind = "", excludeSelf }: GetUserOptions) => {
  toFind = toFind.toLowerCase()

  let target = bot.users.cache.get(toFind)

  if (!target && message.mentions.users) target = message.mentions.users.first()

  if (!target && !excludeSelf) target = message.author

  return target
}
