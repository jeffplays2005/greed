import type { Collection, User } from "discord.js"

export class CooldownHelper {
  private cooldowns: Collection<`${User["id"]}:${string}`, number>
  private cleanupInterval: NodeJS.Timeout | null

  constructor(cooldownsCollection: Collection<`${User["id"]}:${string}`, number>) {
    this.cooldowns = cooldownsCollection
    // Clean up expired cooldowns every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
  }

  /**
   * Checks if a user is on cooldown for a specific command and returns the cooldown in ms.
   * Returns 0 if not on cooldown or cooldown has expired.
   *
   * @param userId The ID of the {@link User} to check.
   * @param command The name of the command to check cooldown for.
   * @returns The remaining cooldown time in milliseconds, or 0 if not on cooldown or cooldown has expired.
   */
  public isOnCooldown(userId: string, command: string): number {
    const key: `${string}:${string}` = `${userId}:${command}`
    const entry = this.cooldowns.get(key)
    if (!entry) return 0

    const now = Date.now()
    if (now >= entry) {
      this.cooldowns.delete(key)
      return 0
    }
    return entry - now
  }

  /**
   * Sets a cooldown for a specific command for a user.
   * Returns if there is no command cooldown
   *
   * @param userId The ID of the {@link User} to set cooldown for.
   * @param command The name of the command to set cooldown for.
   * @param duration The duration of the cooldown in seconds.
   */
  public setCooldown(userId: string, command: string, duration = 0): void {
    if (!duration) return
    const key: `${string}:${string}` = `${userId}:${command}`
    const now = Date.now()
    this.cooldowns.set(key, now + duration * 1000)
  }

  /**
   * Removes all expired cooldowns
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cooldowns.entries()) {
      if (now >= entry) {
        this.cooldowns.delete(key)
      }
    }
  }

  /**
   * Destroy the cooldown manager and clean up resources
   */
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cooldowns.clear()
  }
}
