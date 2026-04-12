import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"

export const run = async ({ message, color, db, bot }: BaseCommandProps) => {
  const userData = await db.users.getUserById(message.author.id)
  const bal = userData?.userId ? userData.balance : 100

  return message.reply({
    embeds: [
      createSimpleEmbed(
        `${message.author}'s balance is ${bal} ${bot.config.emojis.balance}`,
        color,
      ),
    ],
    allowedMentions: {},
  })
}

export const config: BaseCommandConfig = {
  name: "balance",
  description: "check a users balance",
  aliases: ["bal"],
  usage: ["balance", "balance <user>"],
}
