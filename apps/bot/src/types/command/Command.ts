import type { ColorResolvable, Message } from "discord.js"
import type { Payload } from "payload"
import type { db } from "@/database/collections"
import type { Client } from "../Client"
import type {
  DmsOnlyPermissionSet,
  GuildOnlyPermissionSet,
  NoLocationRestrictionPermissionSet,
} from "./Permissions"

/**
 * The return type of parsed command
 */
export type CommandModule = {
  /**
   * The {@link BaseCommandConfig} command configuration
   */
  config: BaseCommandConfig
  /**
   * The callback function to run when the command is executed
   * @template IsGuild Whether the command is executed in a guild context. This helps commands that
   * can safely assume they're within a guild context and not worry about whether they're in a DM.
   */
  run<IsGuild extends boolean = boolean>(props: BaseCommandProps<IsGuild>): Promise<void> | void
}

/**
 * The base command config type used to unionise typings
 */
export type BaseCommandConfig = {
  /**
   * The name of the command
   */
  name: string
  /**
   * The description of the command (used for help command)
   */
  description: string
  /**
   * A list of usages
   * @remarks Do not include the prefix within the usage, this is appended
   */
  usage: string[]
  /**
   * A list of aliases
   */
  aliases?: string[]
  /**
   * The cooldown in seconds for this command, use 0 for no cooldown
   * @example 1
   */
  cooldown?: number
  /**
   * Various permission config options
   */
  permissionSet?: GuildOnlyPermissionSet | DmsOnlyPermissionSet | NoLocationRestrictionPermissionSet
  /**
   * If the command is disabled
   * @default false
   */
  disabled?: boolean
  /**
   * If the command is dev only
   * @remarks Takes prescedence over other permissions
   * @default false
   */
  dev?: boolean
  /**
   * If the command should be hidden away from the help command
   * @default false
   */
  hide?: boolean
}

/**
 * Base command props
 */
export type BaseCommandProps<IsGuild extends boolean = boolean> = {
  /**
   * The original message to be parsed
   */
  message: Message<IsGuild>
  /**
   * The Payload instance
   */
  payload: Payload
  /**
   * The discord client
   */
  bot: Client
  /**
   * The command that was executed
   * @example ping
   */
  command: string
  /**
   * A string list of arguments passed through during message event
   */
  args: string[]
  /**
   * The database object
   */
  db: typeof db
  /**
   * The prefix the user uses
   */
  prefix: string
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
