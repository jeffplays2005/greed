import { ButtonBuilder, ButtonStyle, ContainerBuilder } from "discord.js"

import type { ButtonInteractionProps } from "@/types/interactions"
import type { ButtonConfig } from "@/types/interactions/Button"
import { SettingsButtons } from "@/types/interactions/enums"

/**
 * Handle just displaying the settings confession configurations
 */
export const run = async ({ bot, interaction, hexColor, db }: ButtonInteractionProps<"cached">) => {
  const server = await db.servers.getOrCreateServerByDiscordId(interaction.guild.id)

  const returnButton = new ButtonBuilder()
    .setCustomId(`${SettingsButtons.SETTINGS_RETURN_BUTTON}-${interaction.user.id}`)
    .setLabel(bot.config.emojis.return)
    .setStyle(ButtonStyle.Secondary)

  const confessionSettingsDisplay = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents((textDisplay) =>
          textDisplay.setContent(
            `### **__${interaction.guild.name}__** confession settings\n-# configure confession settings such as the channel to direct confessions or cooldowns`,
          ),
        )
        .setButtonAccessory((button) =>
          button
            .setCustomId(`${SettingsButtons.CONFESSION_SETTINGS_EDIT}-${interaction.user.id}`)
            .setLabel("📝")
            .setStyle(ButtonStyle.Primary),
        ),
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `**the channel for confessions to be sent to**\n${server.confessionSettings?.channel ? `<#${server.confessionSettings?.channel}>` : "none"}`,
      ),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `**configure the cooldown for confessions**\n${server.confessionSettings?.cooldownSeconds ? `${server.confessionSettings?.cooldownSeconds / 60}m` : "5m"}`,
      ),
    )
    .addActionRowComponents((actionRow) => actionRow.setComponents(returnButton))

  await interaction.editReply({
    components: [confessionSettingsDisplay],
  })
}

export const config: ButtonConfig = {
  name: SettingsButtons.CONFESSION_SETTINGS_BUTTON,
  update: true,
  ephemeral: false,
}
