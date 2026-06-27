import {
  ContainerBuilder,
  MediaGalleryBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js"
import { SettingsButtons } from "@/types/interactions"
import type { ButtonConfig, ButtonInteractionProps } from "@/types/interactions/Button"
import PhishingImgHelper from "@/utils/phishing-img-helper"
import { run as runImageView } from "./s_psh_img_view_imgs"

enum InteractionIds {
  SHOW_DETAILED_VIEW = "s_psh_img_detailed_view_select",
}

const truncate = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value

export const run = async ({ interaction, db, hexColor, bot }: ButtonInteractionProps<"cached">) => {
  const settings = await db.servers.getOrCreateServerByDiscordId(interaction.guild.id)
  const images = settings.phishingImageSettings?.bannedImages?.filter((image) => image.id) ?? []

  if (!images.length) {
    return runImageView({ interaction, db, hexColor, bot } as ButtonInteractionProps<"cached">)
  }

  const imageSelector = new StringSelectMenuBuilder()
    .setCustomId(InteractionIds.SHOW_DETAILED_VIEW)
    .setPlaceholder("select banned image to display more details for")

  images.slice(0, 25).forEach((image) => {
    imageSelector.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(truncate(image.description || "unnamed banned image", 100))
        .setDescription(truncate(image.imageHash || "no image hash", 100))
        .setValue(image.id as string),
    )
  })

  const showDetailedImageView = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `### **__${interaction.guild.name}__** display detailed view of banned image\n-# select a configured image to display more details for`,
      ),
    )
    .addSeparatorComponents((separator) => separator)
    .addActionRowComponents((actionRow) => actionRow.setComponents(imageSelector))

  const message = await interaction.editReply({
    components: [showDetailedImageView],
    flags: MessageFlags.IsComponentsV2,
  })

  const collector = message.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    time: 60000,
  })

  collector.on("collect", async (i) => {
    if (!i.isStringSelectMenu() || i.customId !== InteractionIds.SHOW_DETAILED_VIEW) return

    const selectedImageId = i.values[0]
    if (!selectedImageId) return

    const selectedImage = images.find((image) => image.id === selectedImageId)
    if (!selectedImage) return

    await i.deferUpdate()

    collector.stop("complete")

    const imageAttachment = await PhishingImgHelper.transformMsgUrlToAttachment(
      bot,
      selectedImage.imageUrl,
    )

    if (!imageAttachment) return

    const detailedViewComponent = new ContainerBuilder()
      .setAccentColor(hexColor)
      .addTextDisplayComponents((textDisplay) =>
        textDisplay.setContent(
          `### **__${interaction.guild.name}__** banned image details
**image description:** ${selectedImage.description || "unnamed banned image"}
**image hash:** ${selectedImage.imageHash || "no image hash"}
**document ref id:** ${selectedImageId}`,
        ),
      )

    const gallery = new MediaGalleryBuilder().addItems((mediaGalleryItem) =>
      mediaGalleryItem
        .setDescription(imageAttachment?.description || "unnamed banned image")
        .setURL(imageAttachment.url),
    )

    await i.editReply({
      components: [detailedViewComponent, gallery],
    })
  })

  collector.on("end", async (_collected, reason) => {
    if (reason === "time") {
      await runImageView({ interaction, db, hexColor, bot } as ButtonInteractionProps<"cached">)
    }
  })
}

export const config: ButtonConfig = {
  name: SettingsButtons.PHISHING_IMAGE_SETTINGS_DETAILED_IMG_VIEW,
  update: false,
  ephemeral: true,
}
