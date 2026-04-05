import { inspect } from "node:util"
// biome-ignore lint/correctness/noUnusedImports: for use during eval
import * as Discord from "discord.js"
import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"

export const run = ({ bot, message, args }: BaseCommandProps) => {
  if (message.author.id !== "543185949803151370") return

  const clean = (toCheck: unknown) => {
    let textToCheck = String(toCheck) // Convert to string to handle all types

    if (textToCheck.includes(bot.token)) {
      textToCheck = textToCheck.replace(bot.token, "Not for your evil eyes!")
    }

    return textToCheck
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
  }

  try {
    const code = args.join(" ")
    // biome-ignore lint/security/noGlobalEval: dev only
    let evaled = eval(code)

    if (typeof evaled !== "string") evaled = inspect(evaled)

    message
      .reply({ content: `\`\`\`xl\n${clean(evaled)}\`\`\``, allowedMentions: {} })
      .catch((err) =>
        message.reply({
          content: `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``,
          allowedMentions: {},
        }),
      )
    return
  } catch (err) {
    return message.reply({
      content: `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``,
      allowedMentions: {},
    })
  }
}

export const config: BaseCommandConfig = {
  name: "eval",
  description: "evaluates dev code",
  aliases: ["evaluate"],
  usage: ["eval <code>"],
  hide: true,
  dev: true,
}
