import type { Message } from "discord.js"
import type { Client } from "../Client"

/**
 * Base command props
 */
export type BaseCommandProps = {
  /**
   * The original message to be parsed
   */
  message: Message
  /**
   * The discord client
   */
  bot: Client
  /**
   * A string list of arguments passed through during message event
   */
  args: string[]
  /**
   * The database object
   * @remarks TODO
   */
  db: unknown
  /**
   * The prefix the user uses
   */
  prefix: string
  /**
   * The embed color to use
   * @default #2f3136
   */
  color: string
}
