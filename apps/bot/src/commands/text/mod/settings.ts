import { ButtonStyle, ContainerBuilder, MessageFlags } from "discord.js"
import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { SettingsButtons } from "@/types/interactions"

export const run = async ({ message, hexColor }: BaseCommandProps<true>) => {
  const settingsContainer = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `### **__${message.guild.name}__** settings\n-# select from one of the dropdowns to configure settings or click the buttons`,
      ),
    )
    .addSeparatorComponents((separator) => separator)
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents((textDisplay) =>
          textDisplay.setContent(
            "**confession settings**\n-# configure confessions, channel to direct confessions or cooldowns",
          ),
        )
        .setButtonAccessory((button) =>
          button
            .setCustomId(`${SettingsButtons.CONFESSION_SETTINGS_BUTTON}-${message.author.id}`)
            .setLabel("⚙️")
            .setStyle(ButtonStyle.Primary),
        ),
    )

  return message.reply({
    components: [settingsContainer],
    flags: MessageFlags.IsComponentsV2,
    allowedMentions: {},
  })
}

export const config: BaseCommandConfig = {
  name: "settings",
  description: "command to configure server settings",
  aliases: [],
  usage: ["settings"],
  permissionSet: {
    guildOnly: true,
    userPermissionsRequired: ["ManageGuild"],
  },
}
