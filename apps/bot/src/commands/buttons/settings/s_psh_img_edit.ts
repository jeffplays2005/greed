import type { PhishingImageActions as PayloadPhishingImageActions } from "@repo/shared/payload-types"
import {
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js"
import { PhishingImageActions, SettingsButtons } from "@/types/interactions"
import type { ButtonConfig, ButtonInteractionProps } from "@/types/interactions/Button"
import { run as runSettings } from "./s_psh_img"

enum InteractionIds {
  DEFAULT_ACTION_SELECT = "s_psh_img_action_select",
}

export const run = async ({ bot, interaction, db, hexColor }: ButtonInteractionProps<"cached">) => {
  const settings = await db.servers.getOrCreateServerByDiscordId(interaction.guild.id)
  const phishingImageSettings = settings.phishingImageSettings ?? {
    defaultAction: PhishingImageActions.BAN,
  }
  const defaultAction = phishingImageSettings.defaultAction || PhishingImageActions.BAN

  const defaultActionSelector = new StringSelectMenuBuilder()
    .setCustomId(`${InteractionIds.DEFAULT_ACTION_SELECT}`)
    .setPlaceholder(defaultAction?.toLowerCase() ?? "select default action")

  Object.entries(PhishingImageActions).forEach(([key, value]) => {
    defaultActionSelector.addOptions(
      new StringSelectMenuOptionBuilder().setLabel(value.toLowerCase()).setValue(key),
    )
  })

  const returnButton = new ButtonBuilder()
    .setCustomId(`${SettingsButtons.PHISHING_IMAGE_SETTINGS_BUTTON}-${interaction.user.id}`)
    .setLabel(bot.config.emojis.return)
    .setStyle(ButtonStyle.Secondary)

  const phishingImageSettingsView = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `### **__${interaction.guild.name}__** image phishing settings\n-# configure automod config for detecting common scam images, fake giveaways, and impersonation attempts`,
      ),
    )
    .addSeparatorComponents((separator) => separator)
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents((textDisplay) =>
          textDisplay.setContent(
            `**number of banned images**\n${phishingImageSettings?.bannedImages?.length || 0}`,
          ),
        )
        .setButtonAccessory((button) =>
          button
            .setCustomId(
              `${SettingsButtons.PHISHING_IMAGE_SETTINGS_VIEW_IMAGES}-${interaction.user.id}`,
            )
            .setLabel(bot.config.emojis.view)
            .setStyle(ButtonStyle.Primary),
        ),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent("**configure the default action for phishing images**"),
    )
    .addActionRowComponents((actionRow) => actionRow.setComponents(defaultActionSelector))
    .addActionRowComponents((actionRow) => actionRow.setComponents(returnButton))

  const message = await interaction.editReply({
    components: [phishingImageSettingsView],
  })

  /**
   * Collector logic for interactions
   */

  const collector = message.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    time: 60000,
  })

  collector.on("collect", async (i) => {
    if (i.isStringSelectMenu() && i.customId === InteractionIds.DEFAULT_ACTION_SELECT) {
      const settings = await db.servers.getOrCreateServerByDiscordId(interaction.guild.id)

      const phishingImageSettings = settings.phishingImageSettings ?? {}
      phishingImageSettings.defaultAction = i.values[0] as PayloadPhishingImageActions

      await db.servers.updateServerById(settings.id, { phishingImageSettings })

      collector.stop("complete")
      await i.deferUpdate()
      await runSettings({ bot, interaction, hexColor, db } as ButtonInteractionProps<"cached">)
    } else if (
      i.customId !== `${SettingsButtons.PHISHING_IMAGE_SETTINGS_VIEW_IMAGES}-${interaction.user.id}`
    ) {
      collector.stop("canceled")
    }
  })

  collector.on("end", async (_collected, reason) => {
    if (reason === "time") {
      await runSettings({ bot, interaction, hexColor, db } as ButtonInteractionProps<"cached">)
    }
  })
}

export const config: ButtonConfig = {
  name: SettingsButtons.PHISHING_IMAGE_SETTINGS_EDIT,
  update: true,
  ephemeral: false,
}
