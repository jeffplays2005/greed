import type { ColorResolvable } from "discord.js"
import type { Payload } from "payload"
import type { db } from "@/database/collections"
import type { Client } from "../Client"

/**
 * Base interaction props to extend off from for interactions/context menus/buttons
 */
export interface BaseInteractionProp {
  /**
   * The Payload instance
   */
  payload: Payload
  /**
   * The discord client
   */
  bot: Client
  /**
   * The database object
   */
  db: typeof db
  /**
   * The embed color to use
   * @default #2f3136
   */
  color: ColorResolvable
  /**
   * The hex color to use
   * @default 0x2f3136
   */
  hexColor: number
}
