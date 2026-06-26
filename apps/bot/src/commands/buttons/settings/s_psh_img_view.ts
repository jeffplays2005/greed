import { ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags } from "discord.js"
import { SettingsButtons } from "@/types/interactions"
import type { ButtonConfig, ButtonInteractionProps } from "@/types/interactions/Button"

export const run = async ({ bot, interaction, db, hexColor }: ButtonInteractionProps<"cached">) => {
  const settings = await db.servers.getOrCreateServerByDiscordId(interaction.guild.id)
  const images = settings.phishingImageSettings?.bannedImages ?? []

  const hashes = images.length
    ? images.map((hash) => `${hash}`).join("\n")
    : "-# no banned image hashes configured"

  const addButton = new ButtonBuilder()
    .setCustomId(`${SettingsButtons.PHISHING_IMAGE_SETTINGS_ADD_IMAGE}-${interaction.user.id}`)
    .setLabel("+")
    .setStyle(ButtonStyle.Success)

  const reloadButton = new ButtonBuilder()
    .setCustomId(`${SettingsButtons.PHISHING_IMAGE_SETTINGS_VIEW_IMAGES}-${interaction.user.id}`)
    .setLabel(bot.config.emojis.reload)
    .setStyle(ButtonStyle.Primary)

  const imageViewContainer = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `### **__${interaction.guild.name}__** banned image hashes\n-# add or remove image hashes used by image phishing protection`,
      ),
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**configured hashes**\n${hashes}`),
    )

  imageViewContainer.addActionRowComponents((actionRow) =>
    actionRow.setComponents(addButton, reloadButton),
  )

  await interaction.editReply({
    components: [imageViewContainer.toJSON()],
    flags: MessageFlags.IsComponentsV2,
  })
}

export const config: ButtonConfig = {
  name: SettingsButtons.PHISHING_IMAGE_SETTINGS_VIEW_IMAGES,
  update: false,
  ephemeral: true,
}
