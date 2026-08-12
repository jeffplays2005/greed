import {
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  ContainerBuilder,
} from "discord.js"

import { type ButtonInteractionProps, SettingsButtons } from "@/types/interactions"
import type { ButtonConfig } from "@/types/interactions/Button"
import { run as runSettings } from "./s_ntf"

enum InteractionIds {
  BUMP_CHANNEL_SELECT = "ntf_bump_channel_select",
  MODERATION_CHANNEL_SELECT = "ntf_moderation_channel_select",
  NOTIFICATION_CONFIRM = "ntf_confirm-ignore",
}

export const run = async ({ bot, interaction, hexColor, db }: ButtonInteractionProps<"cached">) => {
  let server = await db.servers.getOrCreateServerByDiscordId(interaction.guild.id)
  let bumpChannelId: string | null = null
  let moderationChannelId: string | null = null

  const bumpChannelSelector = new ChannelSelectMenuBuilder()
    .setCustomId(InteractionIds.BUMP_CHANNEL_SELECT)
    .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    .setPlaceholder(
      server.notificationSettings?.bumpChannel
        ? `#${interaction.guild.channels.cache.get(server.notificationSettings.bumpChannel)?.name ?? "configured channel"}`
        : "select channel",
    )

  const moderationChannelSelector = new ChannelSelectMenuBuilder()
    .setCustomId(InteractionIds.MODERATION_CHANNEL_SELECT)
    .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    .setPlaceholder(
      server.notificationSettings?.moderationChannel
        ? `#${interaction.guild.channels.cache.get(server.notificationSettings.moderationChannel)?.name ?? "configured channel"}`
        : "select channel",
    )

  const confirmButton = new ButtonBuilder()
    .setCustomId(InteractionIds.NOTIFICATION_CONFIRM)
    .setLabel("Confirm")
    .setStyle(ButtonStyle.Success)

  const cancelButton = new ButtonBuilder()
    .setCustomId(`${SettingsButtons.NOTIFICATION_SETTINGS_BUTTON}-${interaction.user.id}`)
    .setLabel("Cancel")
    .setStyle(ButtonStyle.Danger)

  const settingsEditView = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `### **__${interaction.guild.name}__** notification settings\n-# configure where server notifications are sent`,
      ),
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent("**configure the channel for bump reminders**"),
    )
    .addActionRowComponents((actionRow) => actionRow.setComponents(bumpChannelSelector))
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent("**configure the channel for moderation actions**"),
    )
    .addActionRowComponents((actionRow) => actionRow.setComponents(moderationChannelSelector))
    .addActionRowComponents((actionRow) => actionRow.setComponents(confirmButton, cancelButton))

  const message = await interaction.editReply({
    components: [settingsEditView],
  })

  const collector = message.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    time: 60000,
  })

  collector.on("collect", async (i) => {
    if (i.isChannelSelectMenu() && i.customId === InteractionIds.BUMP_CHANNEL_SELECT) {
      bumpChannelId = i.values[0] ?? null
      await i.deferUpdate()
    } else if (i.isChannelSelectMenu() && i.customId === InteractionIds.MODERATION_CHANNEL_SELECT) {
      moderationChannelId = i.values[0] ?? null
      await i.deferUpdate()
    } else if (i.isButton() && i.customId === InteractionIds.NOTIFICATION_CONFIRM) {
      server = await db.servers.getOrCreateServerByDiscordId(interaction.guild.id)

      await db.servers.updateServerById(server.id, {
        notificationSettings: {
          bumpChannel: bumpChannelId ?? server.notificationSettings?.bumpChannel,
          moderationChannel: moderationChannelId ?? server.notificationSettings?.moderationChannel,
        },
      })

      collector.stop("confirmed")
      await runSettings({ bot, interaction, hexColor, db } as ButtonInteractionProps<"cached">)
    } else {
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
  name: SettingsButtons.NOTIFICATION_SETTINGS_EDIT,
  update: true,
  ephemeral: false,
}
