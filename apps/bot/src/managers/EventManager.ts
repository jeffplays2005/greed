import { type Client, Events } from "discord.js"
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
