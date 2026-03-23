import type { Client as BaseClient, Collection } from "discord.js"

/**
 * The modified Client type so we can modify the client object
 */
export type Client<T extends boolean = true> = BaseClient<T> & {
  /**
   * The collection for storing text commands
   */
  commands?: Collection<string, unknown>
  /**
   * Collection to map text aliases to their base commands
   */
  aliases?: Collection<string, unknown>
  /**
   * The collection for storing interactions
   */
  interactions?: Collection<string, unknown>
}
