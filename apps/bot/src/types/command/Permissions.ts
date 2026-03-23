/**
 * Base permission set fields
 */
type BasePermissionSet = {
  /**
   * If a blacklisted user can still access this command
   * @remarks TODO
   */
  blacklistAllowed?: boolean
  /**
   * If the command should be used in the support server only
   */
  supportOnly?: boolean
  /**
   * If the command should be disabled in the support server
   */
  supportDisabled?: boolean
  /**
   * If there are any required permissions for the bot.
   * @remarks TODO
   */
  requiredPermissions?: string[]
  /**
   * Any user permissions required.
   * @remarks TODO
   */
  userPermissionsRequired?: string[]
}

/**
 * Permission set for guild-only commands
 */
export type GuildOnlyPermissionSet = BasePermissionSet & {
  guildOnly: true
  dmsOnly?: never
}

/**
 * Permission set for DM-only commands
 */
export type DmsOnlyPermissionSet = BasePermissionSet & {
  dmsOnly: true
  guildOnly?: never
}

/**
 * Permission set with no location restrictions
 */
export type NoLocationRestrictionPermissionSet = BasePermissionSet & {
  guildOnly?: never
  dmsOnly?: never
}
