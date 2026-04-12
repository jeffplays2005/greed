import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"

export const run = async ({ message, color, db, prefix, bot }: BaseCommandProps) => {
  const userData = await db.users.getUserById(message.author.id)
  if (!userData || !userData.balance)
    return message.reply({
      embeds: [
        createSimpleEmbed(
          `${message.author} hasn't been registered to a team yet. \`${prefix}register\` to register!`,
          color,
        ),
      ],
      allowedMentions: {},
    })

  return message.reply({
    embeds: [
      createSimpleEmbed(
        `${message.author}'s balance is ${userData.balance} ${bot.config.emojis.balance}`,
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
