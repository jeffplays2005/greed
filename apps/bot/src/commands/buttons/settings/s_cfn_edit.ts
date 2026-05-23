import {
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ContainerBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js"
import { type ButtonInteractionProps, SettingsButtons } from "@/types/interactions"
import type { ButtonConfig } from "@/types/interactions/Button"
import { run as runSettings } from "./s_cfn"

enum InteractionIds {
  CONFESSION_CHANNEL_SELECT = "cfn_channel_select",
  CONFESSION_COOLDOWN_SELECT = "cfn_cooldown_select",
  CONFESSION_CONFIRM = "cfn_confirm-ignore",
}

export const run = async ({ interaction, hexColor, db }: ButtonInteractionProps<"cached">) => {
  let server = await db.servers.getOrCreateServerByDiscordId(interaction.guild.id)

  const channelSelector = new ChannelSelectMenuBuilder()
    .setCustomId(InteractionIds.CONFESSION_CHANNEL_SELECT)
    .setPlaceholder(
      server.confessionSettings?.channel
        ? `#${interaction.guild.channels.cache.get(server.confessionSettings?.channel)?.name}`
        : "select channel",
    )

  const cooldownMap: Record<string, number> = {
    "1m": 60,
    "5m": 300,
    "10m": 600,
    "15m": 900,
    "30m": 1800,
    "1hr": 3600,
  }
  const cooldownSelector = new StringSelectMenuBuilder()
    .setCustomId(InteractionIds.CONFESSION_COOLDOWN_SELECT)
    .setPlaceholder(
      server.confessionSettings?.cooldownSeconds
        ? `${Object.keys(cooldownMap).find((k) => cooldownMap[k] === server.confessionSettings?.cooldownSeconds) || `${server.confessionSettings?.cooldownSeconds / 60}m`}`
        : "select cooldown",
    )
  Object.keys(cooldownMap).forEach((cooldown) => {
    cooldownSelector.addOptions(
      new StringSelectMenuOptionBuilder().setLabel(cooldown).setValue(cooldown),
    )
  })

  const state: { channelId: string | null; cooldownSeconds: number | null } = {
    channelId: null,
    cooldownSeconds: null,
  }

  const confirmButton = new ButtonBuilder()
    .setCustomId(InteractionIds.CONFESSION_CONFIRM)
    .setLabel("Confirm")
    .setStyle(ButtonStyle.Success)

  const cancelButton = new ButtonBuilder()
    .setCustomId(`${SettingsButtons.CONFESSION_SETTINGS_BUTTON}-${interaction.user.id}`)
    .setLabel("Cancel")
    .setStyle(ButtonStyle.Danger)

  const settingsEditView = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `### **__${interaction.guild.name}__** settings\n-# configure confession settings such as the channel to direct confessions or cooldowns`,
      ),
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent("**configure the channel for confessions to be sent to**"),
    )
    .addActionRowComponents((actionRow) => actionRow.setComponents(channelSelector))
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent("**configure the cooldown for confessions**"),
    )
    .addActionRowComponents((actionRow) => actionRow.setComponents(cooldownSelector))
    .addActionRowComponents((actionRow) => actionRow.setComponents(confirmButton, cancelButton))

  const message = await interaction.editReply({
    components: [settingsEditView],
  })

  const collector = message.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    time: 60000,
  })

  collector.on("collect", async (i) => {
    if (i.isStringSelectMenu() && i.customId === InteractionIds.CONFESSION_COOLDOWN_SELECT) {
      const selected = i.values[0]
      if (selected && cooldownMap[selected]) {
        state.cooldownSeconds = cooldownMap[selected]
      }
      await i.deferUpdate()
    } else if (i.isChannelSelectMenu() && i.customId === InteractionIds.CONFESSION_CHANNEL_SELECT) {
      const selected = i.values[0]
      if (selected) {
        state.channelId = selected
      }
      await i.deferUpdate()
    } else if (i.isButton() && i.customId === InteractionIds.CONFESSION_CONFIRM) {
      server = await db.servers.getOrCreateServerByDiscordId(interaction.guild.id)

      await db.servers.updateServerById(server.id, {
        confessionSettings: {
          channel: state.channelId !== null ? state.channelId : server.confessionSettings?.channel,
          cooldownSeconds:
            state.cooldownSeconds !== null
              ? state.cooldownSeconds
              : server.confessionSettings?.cooldownSeconds,
        },
      })

      collector.stop("confirmed")
      await runSettings({ interaction, hexColor, db } as ButtonInteractionProps<"cached">)
    } else {
      collector.stop("canceled")
    }
  })

  collector.on("end", async (_collected, reason) => {
    if (reason === "time") {
      await runSettings({ interaction, hexColor, db } as ButtonInteractionProps<"cached">)
    }
  })
}

export const config: ButtonConfig = {
  name: "s_cfn_edit",
  update: true,
  ephemeral: false,
}
