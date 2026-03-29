import type { BaseCommandConfig, BaseCommandProps } from "src/types/command"

export const run = async ({ message, command }: BaseCommandProps) => {
  const emojiToUse = command === "poop" ? "💩" : "💦"
  await message.reply({
    content: `${emojiToUse} stfu`,
    allowedMentions: {},
  })
}

export const config: BaseCommandConfig = {
  name: "poop",
  description: "stfu",
  aliases: ["pee"],
  usage: ["poop"],
  cooldown: 5,
}
