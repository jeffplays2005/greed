import { LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js"
import { SettingsButtons } from "@/types/interactions"
import type { ButtonConfig, ButtonInteractionProps } from "@/types/interactions/Button"
import { createSimpleEmbed } from "@/utils/embeds"
import PhishingImgHelper from "@/utils/phishing-img-helper"

export const run = async ({ bot, interaction, color }: ButtonInteractionProps<"cached">) => {
  const InteractionIds = {
    ADD_IMAGE_MODAL: "add_image_modal",
    IMAGE_NAME_INPUT: "image_name_input",
    IMAGE_URL_INPUT: "image_url_input",
  }

  const phishingImageNameInput = new TextInputBuilder()
    .setCustomId(InteractionIds.IMAGE_NAME_INPUT)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("mr beast scam image")

  const phishingImageNameLabel = new LabelBuilder()
    .setLabel("the name or description of the image")
    .setDescription(
      "this makes it easy to identify the image when it appears in the phishing image list",
    )
    .setTextInputComponent(phishingImageNameInput)

  const phishingImageURLInput = new TextInputBuilder()
    .setCustomId(InteractionIds.IMAGE_URL_INPUT)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("https://example.com/image.jpg")

  const phishingImageURLLabel = new LabelBuilder()
    .setLabel("the URL of the image")
    .setDescription(
      "so we know what image to block, also ensure this is a valid discord attachment URL",
    )
    .setTextInputComponent(phishingImageURLInput)

  const newPhishingImageModal = new ModalBuilder()
    .setCustomId(InteractionIds.ADD_IMAGE_MODAL)
    .setTitle("add banned image hash")
    .addLabelComponents(phishingImageNameLabel, phishingImageURLLabel)

  await interaction.showModal(newPhishingImageModal)

  /**
   * Logic to handle modal submission
   */

  const modalInteraction = await interaction
    .awaitModalSubmit({
      filter: (modalSubmit) =>
        modalSubmit.user.id === interaction.user.id &&
        modalSubmit.customId === InteractionIds.ADD_IMAGE_MODAL,
      time: 60000,
    })
    .catch(() => null)
  if (!modalInteraction) return
  await modalInteraction.deferUpdate()

  const imageName = modalInteraction.fields
    .getTextInputValue(InteractionIds.IMAGE_NAME_INPUT)
    .trim()
  const imageURL = modalInteraction.fields.getTextInputValue(InteractionIds.IMAGE_URL_INPUT).trim()

  if (!imageName || !imageURL || !imageURL.startsWith("https")) return

  const msg = await PhishingImgHelper.uploadImg(bot, imageURL)
  const attachment = msg?.attachments.first()
  if (!msg || !attachment) return

  const imageHash = await PhishingImgHelper.getImgHash(attachment.url)
  if (!imageHash) return

  await bot.db.servers.addPhishingImage(interaction.guild.id, imageName, imageHash, msg.url)

  return interaction.channel?.send({
    embeds: [createSimpleEmbed(`added banned image hash for \`${imageName}\``, color)],
    allowedMentions: {},
  })
}
export const config: ButtonConfig = {
  name: SettingsButtons.PHISHING_IMAGE_SETTINGS_ADD_IMAGE,
  update: false,
  ephemeral: false,
}
