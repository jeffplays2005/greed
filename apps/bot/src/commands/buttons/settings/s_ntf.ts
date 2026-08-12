import { ButtonBuilder, ButtonStyle, ContainerBuilder } from "discord.js"

import type { ButtonInteractionProps } from "@/types/interactions"
import type { ButtonConfig } from "@/types/interactions/Button"
import { SettingsButtons } from "@/types/interactions/enums"

export const run = async ({ bot, interaction, hexColor, db }: ButtonInteractionProps<"cached">) => {
  const server = await db.servers.getOrCreateServerByDiscordId(interaction.guild.id)

  const returnButton = new ButtonBuilder()
    .setCustomId(`${SettingsButtons.SETTINGS_RETURN_BUTTON}-${interaction.user.id}`)
    .setLabel(bot.config.emojis.return)
    .setStyle(ButtonStyle.Secondary)

  const notificationSettingsDisplay = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents((textDisplay) =>
          textDisplay.setContent(
            `### **__${interaction.guild.name}__** notification settings\n-# configure where server notifications are sent`,
          ),
        )
        .setButtonAccessory((button) =>
          button
            .setCustomId(`${SettingsButtons.NOTIFICATION_SETTINGS_EDIT}-${interaction.user.id}`)
            .setLabel("📝")
            .setStyle(ButtonStyle.Primary),
        ),
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `**bump reminder channel**\n${server.notificationSettings?.bumpChannel ? `<#${server.notificationSettings.bumpChannel}>` : "none"}\n\n**moderation channel**\n${server.notificationSettings?.moderationChannel ? `<#${server.notificationSettings.moderationChannel}>` : "none"}`,
      ),
    )
    .addActionRowComponents((actionRow) => actionRow.setComponents(returnButton))

  await interaction.editReply({
    components: [notificationSettingsDisplay],
  })
}

export const config: ButtonConfig = {
  name: SettingsButtons.NOTIFICATION_SETTINGS_BUTTON,
  update: true,
  ephemeral: false,
}
