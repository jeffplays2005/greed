import type { Message } from "discord.js"
import type { Client } from "@/types/Client"

export type GetMemberOptions<T extends boolean> = {
  /**
   * The message object
   */
  message: Message
  /**
   * The string to search for (display name or tag)
   */
  toFind?: string
  /**
   * Fallsback to returning the message's member themselves if nobody was found.
   */
  excludeSelf: T
}

export type GetUserOptions<T extends boolean> = {
  /**
   * The message object
   */
  message: Message
  /**
   * The Discord client it self for fetching users
   */
  bot: Client
  /**
   * The string to search for (display name or tag)
   */
  toFind?: string
  /**
   * Fallsback to returning the message's user themselves if nobody was found.
   */
  excludeSelf: T
}
