import { type Message, PermissionsBitField } from "discord.js"
import { InternalPermissions } from "src/types/Config"
import type { BaseCommandConfig, BaseCommandProps } from "src/types/command"

export const run = ({ message, args }: BaseCommandProps<true>) => {
  // Check for keyword first
  const checkForKeyword = args[0] !== "" && Number.isNaN(Number(args[0]))

  const purgeCount = checkForKeyword ? args[1] : args[0]

  let amount = (Number.isNaN(Number(purgeCount)) ? 50 : Number(purgeCount)) + 1
  if (amount > 99) amount = 99

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
