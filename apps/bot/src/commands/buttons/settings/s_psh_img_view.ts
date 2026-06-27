import { ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags } from "discord.js"
import { SettingsButtons } from "@/types/interactions"
import type { ButtonConfig, ButtonInteractionProps } from "@/types/interactions/Button"

export const run = async ({ bot, interaction, db, hexColor }: ButtonInteractionProps<"cached">) => {
  const settings = await db.servers.getOrCreateServerByDiscordId(interaction.guild.id)
  const images = settings.phishingImageSettings?.bannedImages ?? []

  const bannedImageNames = images.length
    ? images.map((image) => `\`${image.description}\``).join("\n")
    : "-# no banned images configured"

  const addButton = new ButtonBuilder()
    .setCustomId(`${SettingsButtons.PHISHING_IMAGE_SETTINGS_ADD_IMAGE}-${interaction.user.id}`)
    .setLabel("+")
    .setStyle(ButtonStyle.Success)

  const removeButton = new ButtonBuilder()
    .setCustomId(`${SettingsButtons.PHISHING_IMAGE_SETTINGS_REMOVE_IMAGE}-${interaction.user.id}`)
    .setLabel("-")
    .setStyle(ButtonStyle.Danger)
    .setDisabled(!images.some((image) => image.id))

  const reloadButton = new ButtonBuilder()
    .setCustomId(`${SettingsButtons.PHISHING_IMAGE_SETTINGS_VIEW_IMAGES}-${interaction.user.id}`)
    .setLabel(bot.config.emojis.reload)
    .setStyle(ButtonStyle.Primary)

  const imageViewContainer = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `### **__${interaction.guild.name}__** banned phishing images\n-# add or remove images used by image phishing protection. note that when new images are added, you must reload the message to see the updated changes!`,
      ),
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**configured banned images**\n${bannedImageNames}`),
    )

  imageViewContainer.addActionRowComponents((actionRow) =>
    actionRow.setComponents(addButton, removeButton, reloadButton),
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
