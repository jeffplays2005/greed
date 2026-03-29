import type { ColorResolvable, Message } from "discord.js"
import type { Client } from "../Client"
import type { BaseCommandConfig } from "./Config"

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
 * Base command props
 */
export type BaseCommandProps<IsGuild extends boolean = boolean> = {
  /**
   * The original message to be parsed
   */
  message: Message<IsGuild>
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
  color: ColorResolvable
}
