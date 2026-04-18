import { type ColorResolvable, type Interaction, MessageFlags } from "discord.js"
import type { Client } from "@/types/Client"
import type { ButtonInteractionProps, ButtonModule } from "@/types/interactions"

const ButtonEvent = async (interaction: Interaction, bot: Client) => {
  if (!interaction.isButton()) return

  const customId = interaction.customId
  const [interactionName, ...args] = customId.split("-")

  if (args[0] !== interaction.user.id) {
    return interaction.reply({
      content: "start your own interaction...",
      flags: [MessageFlags.Ephemeral],
    })
  }

  const buttonModule: ButtonModule | undefined = bot.buttons.get(interactionName)

  if (!buttonModule) return

  const color = bot.config.defaultColor as ColorResolvable
  const hexColor = bot.config.defaultHexColor

  const props: ButtonInteractionProps = {
    interaction,
    payload: bot.payload,
    bot,
    db: bot.db,
    color,
    hexColor,
    interactionName,
    args,
    buttonId: customId as `${string}-${string}`,
  }

  try {
    if (buttonModule.config.update) {
      await interaction.deferUpdate()
    } else if (buttonModule.config.ephemeral) {
      await interaction.deferReply({
        flags: buttonModule.config.ephemeral ? [MessageFlags.Ephemeral] : [],
      })
    }

    await buttonModule.run(props)
  } catch (error) {
    console.error(`[ERROR] Command "${buttonModule.config.name}" execution failed:`, error)
  }
}

export default ButtonEvent
