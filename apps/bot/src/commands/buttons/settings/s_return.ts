import { ButtonStyle, ContainerBuilder } from "discord.js"
import { type ButtonInteractionProps, SettingsButtons } from "@/types/interactions"
import type { ButtonConfig } from "@/types/interactions/Button"

export const run = async ({ interaction, hexColor }: ButtonInteractionProps<"cached">) => {
  const settingsContainer = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `### **__${interaction.guild.name}__** settings\n-# select from one of the dropdowns to configure settings or click the buttons`,
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
            .setCustomId(`${SettingsButtons.CONFESSION_SETTINGS_BUTTON}-${interaction.user.id}`)
            .setLabel("⚙️")
            .setStyle(ButtonStyle.Primary),
        ),
    )
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents((textDisplay) =>
          textDisplay.setContent(
            "**phishing image settings**\n-# configure server image phishing protection settings",
          ),
        )
        .setButtonAccessory((button) =>
          button
            .setCustomId(`${SettingsButtons.PHISHING_IMAGE_SETTINGS_BUTTON}-${interaction.user.id}`)
            .setLabel("⚙️")
            .setStyle(ButtonStyle.Primary),
        ),
    )
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents((textDisplay) =>
          textDisplay.setContent("**notification settings**\n-# configure log channels"),
        )
        .setButtonAccessory((button) =>
          button
            .setCustomId(`${SettingsButtons.NOTIFICATION_SETTINGS_BUTTON}-${interaction.user.id}`)
            .setLabel("⚙️")
            .setStyle(ButtonStyle.Primary),
        ),
    )

  return interaction.editReply({
    components: [settingsContainer],
  })
}

export const config: ButtonConfig = {
  name: SettingsButtons.SETTINGS_RETURN_BUTTON,
  update: true,
  ephemeral: false,
}
