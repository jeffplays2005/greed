import type { Client as BaseClient, Collection, User } from "discord.js"
import type { Config } from "../config"
import type { CacheCollectionKeys } from "./Collection"
import type { CommandModule } from "./command/Command"

/**
 * The modified Client type so we can modify the client object
 */
export type Client<T extends boolean = true> = BaseClient<T> & {
  /**
   * The bots config
   */
  config: typeof Config
  /**
   * Misc collection used to store metadata, etc.
   * TODO: properly type and use interfaces for return items
   */
  cache: Collection<CacheCollectionKeys, unknown>
  /**
   * Cache collection for storing command cooldowns
   */
  cooldowns: Collection<`${User["id"]}:${string}`, number>
  /**
   * The collection for storing text commands
   */
  commands: Collection<string, CommandModule>
  /**
   * Collection to map text aliases to their base commands
   */
  aliases: Collection<string, string>
  /**
   * The collection for storing interactions
   */
  interactions: Collection<string, unknown>
}
