import {
  ChannelSelectMenuBuilder,
  ContainerBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js"

import type { ButtonInteractionProps } from "@/types/interactions"
import type { ButtonConfig } from "@/types/interactions/Button"

export const run = async ({ interaction, hexColor }: ButtonInteractionProps<"cached">) => {
  const cooldownSelector = new StringSelectMenuBuilder()
    .setCustomId("broidk2")
    .setPlaceholder("select cooldown")
  ;["1m", "5m", "10m", "15m", "30m", "1hr"].forEach((cooldown) => {
    cooldownSelector.addOptions(
      new StringSelectMenuOptionBuilder().setLabel(cooldown).setValue(cooldown),
    )
  })
  const confessionSettings = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `### **__${interaction.guild.name}__** settings\n-# configure confession settings such as the channel to direct confessions or cooldowns`,
      ),
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent("**configure the channel for confessions to go to**"),
    )
    .addActionRowComponents((actionRow) =>
      actionRow.setComponents(
        new ChannelSelectMenuBuilder().setCustomId("broidk").setPlaceholder("select channel"),
      ),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent("**configure the cooldown for confessions**"),
    )
    .addActionRowComponents((actionRow) => actionRow.setComponents(cooldownSelector))
  return interaction.editReply({
    components: [confessionSettings],
    flags: MessageFlags.IsComponentsV2,
  })
}

export const config: ButtonConfig = {
  name: "s_cfn",
  update: true,
  ephemeral: false,
}
