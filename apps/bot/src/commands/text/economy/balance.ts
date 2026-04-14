import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"
import { getUser } from "@/utils/parsers"

export const run = async ({ message, args, color, db, bot }: BaseCommandProps) => {
  const user = getUser({ message, bot, toFind: args[0], excludeSelf: false })

  const userData = await db.users.getUserById(user.id)
  const bal = userData?.userId ? userData.balance : 100

  return message.reply({
    embeds: [createSimpleEmbed(`${user}'s balance is ${bal} ${bot.config.emojis.balance}`, color)],
    allowedMentions: {},
  })
}

export const config: BaseCommandConfig = {
  name: "balance",
  description: "check a users balance",
  aliases: ["bal"],
  usage: ["balance", "balance <user>"],
}
