import { ButtonBuilder, ButtonStyle, ContainerBuilder } from "discord.js"
import type { ButtonConfig, ButtonInteractionProps } from "@/types/interactions/Button"
import { SettingsButtons } from "@/types/interactions/enums"

export const run = async ({ bot, interaction, hexColor, db }: ButtonInteractionProps<"cached">) => {
  const server = await db.servers.getOrCreateServerByDiscordId(interaction.guild.id)

  const returnButton = new ButtonBuilder()
    .setCustomId(`${SettingsButtons.SETTINGS_RETURN_BUTTON}-${interaction.user.id}`)
    .setLabel(bot.config.emojis.return)
    .setStyle(ButtonStyle.Secondary)

  const imagePhishingSettingsDisplay = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents((textDisplay) =>
          textDisplay.setContent(
            `### **__${interaction.guild.name}__** image phishing settings\n-# configure automod config for detecting common scam images, fake giveaways, and impersonation attempts`,
          ),
        )
        .setButtonAccessory((button) =>
          button
            .setCustomId(`${SettingsButtons.PHISHING_IMAGE_SETTINGS_EDIT}-${interaction.user.id}`)
            .setLabel("📝")
            .setStyle(ButtonStyle.Primary),
        ),
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `**number of banned images**\n${server.phishingImageSettings?.bannedImages?.length || 0}`,
      ),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**default action**\n${server.phishingImageSettings?.defaultAction}`),
    )
    .addActionRowComponents((actionRow) => actionRow.setComponents(returnButton))

  await interaction.editReply({
    components: [imagePhishingSettingsDisplay],
  })
}

export const config: ButtonConfig = {
  name: SettingsButtons.PHISHING_IMAGE_SETTINGS_BUTTON,
  update: true,
  ephemeral: false,
}
