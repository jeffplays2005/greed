import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"

export const run = async ({ message, color, db, bot }: BaseCommandProps) => {
  const userData = await db.users.getOrCreateUser(message.author.id)

  const outcomes = [
    {
      price: 40,
      text: `you baked a 🍰 and sold it for ${bot.config.emojis.balance} 40!`,
    },
    {
      price: 30,
      text: `you baked some 🥐 and sold them to your neighbour and gained ${bot.config.emojis.balance} 30!`,
    },
    {
      price: -20,
      text: `you burned your dinner and lost ${bot.config.emojis.balance} 20!`,
    },
    {
      price: -10,
      text: `you forgot to put flour in your 🧁 and lost ${bot.config.emojis.balance} 10!`,
    },
    {
      price: 10,
      text: `you baked some 🍪 and sold them for ${bot.config.emojis.balance} 10!`,
    },
  ]

  const outcome = outcomes[Math.floor(Math.random() * outcomes.length)]
  await db.users.updateUser(message.author.id, {
    balance: Math.max(0, Math.round(userData.balance + outcome.price)),
  })

  return message.reply({
    embeds: [createSimpleEmbed(outcome.text, color)],
    allowedMentions: {},
  })
}

export const config: BaseCommandConfig = {
  name: "bake",
  description: "bake something and sell it for money!",
  aliases: [],
  usage: ["bake"],
  cooldown: 4 * 60 * 60,
}
