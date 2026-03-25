import type { BaseCommandConfig, BaseCommandProps } from "src/types/command"

export const run = async ({ message }: BaseCommandProps) => {
  await message.reply({
    content: "💩 stfu",
    allowedMentions: {},
  })
}

export const config: BaseCommandConfig = {
  name: "poop",
  description: "stfu",
  usage: ["poop"],
  cooldown: 5,
}
