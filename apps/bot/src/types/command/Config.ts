import type {
  DmsOnlyPermissionSet,
  GuildOnlyPermissionSet,
  NoLocationRestrictionPermissionSet,
} from "./Permissions"

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
  aliases: string[]
  /**
   * The cooldown in seconds for this command, use 0 for no cooldown
   * @example 1
   */
  cooldown: number
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
