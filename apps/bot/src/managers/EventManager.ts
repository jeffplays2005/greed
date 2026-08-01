import { Events } from "discord.js"
import DetectBumpMessage from "@/events/DetectBumpMessage"
import DetectPhishingImageEvent from "@/events/DetectPhishingImageEvent"
import ReadyConfigEvent from "@/events/ReadyConfigEvent"
import type { Client } from "@/types/Client"
import ButtonEvent from "../events/ButtonEvent"
import MessageEvent from "../events/MessageEvent"
import ReadyEvent from "../events/ReadyEvent"

/**
 * Event helper that passes forward events to their respective event handlers
 *
 * @param bot The bot client
 */
const EventManager = (bot: Client) => {
  bot.once(Events.ClientReady, (readyClient) => {
    ReadyEvent(readyClient)
    ReadyConfigEvent(bot)
  })
  bot.on(Events.MessageCreate, (message) => {
    MessageEvent(message, bot)
    DetectPhishingImageEvent(message, bot)
    DetectBumpMessage(message, bot)
  })
  bot.on(Events.InteractionCreate, (interaction) => {
    ButtonEvent(interaction, bot)
  })
}

export default EventManager
