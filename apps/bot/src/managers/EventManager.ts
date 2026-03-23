import { Events } from "discord.js"
import type { Client } from "src/types/Client"
import ReadyEvent from "../events/ReadyEvent"

/**
 * Event helper that passes forward events to their respective event handlers
 *
 * @param bot The bot client
 */
const EventManager = (bot: Client) => {
  bot.once(Events.ClientReady, (readyClient) => ReadyEvent(readyClient))
}

export default EventManager
