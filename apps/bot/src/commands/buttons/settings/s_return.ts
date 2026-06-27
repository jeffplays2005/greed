import { ButtonStyle, ContainerBuilder } from "discord.js"
import { type ButtonInteractionProps, SettingsButtons } from "@/types/interactions"
import type { ButtonConfig } from "@/types/interactions/Button"

export const run = async ({ interaction, hexColor }: ButtonInteractionProps<"cached">) => {
  const buildMainSettingsView = () => {
    return new ContainerBuilder()
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
  }

  return interaction.editReply({
    components: [buildMainSettingsView()],
  })
}

export const config: ButtonConfig = {
  name: SettingsButtons.CONFESSION_SETTINGS_BUTTON,
  update: true,
  ephemeral: false,
}
