import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"

const DAILY_REWARD = 100

export const run = async ({ message, color, db, bot }: BaseCommandProps) => {
  const userData = await db.users.getOrCreateUser(message.author.id)

  await db.users.updateUser(message.author.id, {
    balance: userData.balance + DAILY_REWARD,
  })

  return message.reply({
    embeds: [
      createSimpleEmbed(
        `you claimed your daily reward of ${bot.config.emojis.balance} ${DAILY_REWARD}!`,
        color,
      ),
    ],
    allowedMentions: {},
  })
}

export const config: BaseCommandConfig = {
  name: "daily",
  description: "claim your daily balance reward",
  aliases: [],
  usage: ["daily"],
  cooldown: 24 * 60 * 60,
}
