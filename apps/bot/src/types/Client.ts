import type { Client as BaseClient, Collection } from "discord.js"
import type { Config } from "../config"
import type { CacheCollectionKeys } from "./Collection"

/**
 * The modified Client type so we can modify the client object
 */
export type Client<T extends boolean = true> = BaseClient<T> & {
  /**
   * The bots config
   */
  config?: typeof Config
  /**
   * Misc collection used to store metadata, etc.
   * TODO: properly type and use interfaces for return items
   */
  cache?: Collection<CacheCollectionKeys, unknown>
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
