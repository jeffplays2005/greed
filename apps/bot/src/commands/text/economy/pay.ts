import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"
import { getUser } from "@/utils/parsers"

export const run = async ({ message, bot, args, color, db }: BaseCommandProps) => {
  const user = await getUser({ message, bot, toFind: args[0], excludeSelf: true })
  if (!user)
    return message.reply({
      embeds: [createSimpleEmbed("you must mention a valid user!", color)],
      allowedMentions: {},
    })

  if (user.bot)
    return message.reply({
      embeds: [createSimpleEmbed("you cannot pay a bot!", color)],
      allowedMentions: {},
    })

  if (user.id === message.author.id)
    return message.reply({
      embeds: [createSimpleEmbed("you cannot pay yourself!", color)],
      allowedMentions: {},
    })

  const payerData = await db.users.getOrCreateUser(message.author.id)
  const payerBalance = payerData.balance

  const amount = Number.parseInt(args[1])
  if (isNaN(amount) || amount <= 0)
    return message.reply({
      embeds: [createSimpleEmbed("you must provide a valid amount to pay!", color)],
      allowedMentions: {},
    })
  if (payerBalance < amount)
    return message.reply({
      embeds: [createSimpleEmbed("you do not have enough balance to pay that amount!", color)],
      allowedMentions: {},
    })

  const payeeData = await db.users.getOrCreateUser(user.id)
  const payeeBalance = payeeData.balance

  await db.users.updateUser(message.author.id, { balance: payerBalance - amount })
  await db.users.updateUser(user.id, { balance: payeeBalance + amount })

  return message.reply({
    embeds: [
      createSimpleEmbed(
        `you have successfully paid ${user} ${amount} ${bot.config.emojis.balance}`,
        color,
      ),
    ],
    allowedMentions: {},
  })
}

export const config: BaseCommandConfig = {
  name: "pay",
  description: "pay a user some balance",
  aliases: [],
  usage: ["pay <user> <amount>"],
}
