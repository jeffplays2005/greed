import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"

export const run = async ({ message, args, color, db, bot }: BaseCommandProps) => {
  const userData = await db.users.getOrCreateUser(message.author.id)
  const { balance } = userData

  let amt: number | string = args[0]
  if (!amt || amt.includes(".") || Number.parseInt(amt) < 0)
    return message.reply({
      embeds: [createSimpleEmbed("invalid amount to coinflip!", color)],
      allowedMentions: {},
    })

  if (Number.parseInt(amt) > balance) {
    return message.reply({
      embeds: [createSimpleEmbed("you don't have enough balance to coinflip that amount!", color)],
      allowedMentions: {},
    })
  }

  if (Number.parseInt(amt) > 250_000) amt = 250_000

  const result = ~~(Math.random() * 2) === 0 ? "heads" : "tails"
  const guess = ~~(Math.random() * 2) === 0 ? "heads" : "tails"

  await db.users.updateUser(message.author.id, {
    balance:
      result === guess
        ? balance + Number.parseInt(amt as string)
        : balance - Number.parseInt(amt as string),
  })

  const reply = await message.reply({
    embeds: [
      createSimpleEmbed(
        `${message.author} spent ${bot.config.emojis.balance} ${Number.parseInt(amt as string)} and chose **${guess}**\nthe coin spins... ${bot.config.emojis.balance_loading}`,
        color,
      ),
    ],
    allowedMentions: {},
  })

  return setTimeout(() => {
    reply
      .edit({
        embeds: [
          createSimpleEmbed(
            `${message.author} spent ${bot.config.emojis.balance} ${Number.parseInt(amt as string)} and chose **${guess}**\nthe coin spins... and you ${result === guess ? "won" : "loss"} ${bot.config.emojis.balance} ${Number.parseInt(amt as string)}`,
            color,
          ),
        ],
        allowedMentions: {},
      })
      .catch()
  }, 2_000)
}

export const config: BaseCommandConfig = {
  name: "coinflip",
  description: "flip a coin to try win some money",
  aliases: ["cf"],
  usage: ["coinflip"],
  cooldown: 15,
  permissionSet: {
    guildOnly: true,
  },
}
