import {
  ContainerBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js"
import { SettingsButtons } from "@/types/interactions"
import type { ButtonConfig, ButtonInteractionProps } from "@/types/interactions/Button"
import { run as runImageView } from "./s_psh_img_view"

enum InteractionIds {
  REMOVE_IMAGE_SELECT = "s_psh_img_remove_select",
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
    .setCustomId(InteractionIds.REMOVE_IMAGE_SELECT)
    .setPlaceholder("select banned image to remove")

  images.slice(0, 25).forEach((image) => {
    imageSelector.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(truncate(image.description || "unnamed banned image", 100))
        .setDescription(truncate(image.imageHash || "no image hash", 100))
        .setValue(image.id as string),
    )
  })

  const removeImageView = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `### **__${interaction.guild.name}__** remove banned image\n-# select a configured image to remove from image phishing protection`,
      ),
    )
    .addSeparatorComponents((separator) => separator)
    .addActionRowComponents((actionRow) => actionRow.setComponents(imageSelector))

  const message = await interaction.editReply({
    components: [removeImageView],
    flags: MessageFlags.IsComponentsV2,
  })

  const collector = message.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    time: 60000,
  })

  collector.on("collect", async (i) => {
    if (!i.isStringSelectMenu() || i.customId !== InteractionIds.REMOVE_IMAGE_SELECT) return

    const selectedImageId = i.values[0]
    if (!selectedImageId) return

    collector.stop("complete")
    await db.servers.removePhishingImage(interaction.guild.id, selectedImageId)
    await i.deferUpdate()
    await runImageView({ interaction, db, hexColor, bot } as ButtonInteractionProps<"cached">)
  })

  collector.on("end", async (_collected, reason) => {
    if (reason === "time") {
      await runImageView({ interaction, db, hexColor, bot } as ButtonInteractionProps<"cached">)
    }
  })
}

export const config: ButtonConfig = {
  name: SettingsButtons.PHISHING_IMAGE_SETTINGS_REMOVE_IMAGE,
  update: false,
  ephemeral: true,
}
