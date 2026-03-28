import { type Message, PermissionsBitField } from "discord.js"
import { InternalPermissions } from "src/types/Config"
import type { BaseCommandConfig, BaseCommandProps } from "src/types/command"

export const run = ({ message, args }: BaseCommandProps<true>) => {
  const hasFirstArg = typeof args[0] === "string" && args[0] !== ""
  const firstArgIsNumeric = hasFirstArg && !Number.isNaN(Number(args[0]))

  const checkForKeyword = hasFirstArg && !firstArgIsNumeric

  const purgeCountArg = checkForKeyword ? args[1] : hasFirstArg ? args[0] : undefined

  const DEFAULT_PURGE_COUNT = 50
  let parsedCount = Number(purgeCountArg)
  if (!Number.isFinite(parsedCount) || !Number.isInteger(parsedCount)) {
    parsedCount = DEFAULT_PURGE_COUNT
  }
  const amount = Math.max(1, Math.min(100, parsedCount))

  if (message.channel.isTextBased() && !message.channel.isDMBased()) {
    message.channel.messages.fetch({ limit: 100, cache: false }).then((messages) => {
      const userMessages = messages
        .filter(
          (m: Message) =>
            m.author.id === message.author.id &&
            (checkForKeyword ? m.content.includes(args[0]) : true),
        )
        .first(amount)
      message.channel.bulkDelete(userMessages)
    })
  }
}

export const config: BaseCommandConfig = {
  name: "sc",
  description: "exclusive command for bot owners to purge their own messages.",
  usage: ["sc", "sc <keyword>", "sc <keyword> <amt>"],
  aliases: ["rc"],
  permissionSet: {
    guildOnly: true,
    userPermissionsRequired: [PermissionsBitField.Flags.ManageMessages],
    internalPermissions: [InternalPermissions.OWNERS],
  },
}
