import type { BotConfig } from "@repo/shared/payload-types"
import type { Payload } from "payload"

export class BotConfigCollection {
  private db: Payload

  constructor(db: Payload) {
    this.db = db
  }

  /**
   * Retrieves the bot configuration document.
   *
   * @returns The BotConfig document
   */
  public async getConfig(): Promise<BotConfig> {
    return await this.db.findGlobal({
      slug: "bot-config",
    })
  }

  /**
   * Updates a bot configuration by its ID.
   *
   * @param configId The ID of the bot configuration to update.
   * @param data The partial data to update the configuration with.
   * @returns The updated BotConfig document.
   */
  public async updateConfigById(data: Partial<BotConfig>): Promise<BotConfig> {
    return await this.db.updateGlobal({
      slug: "bot-config",
      data,
    })
  }

  /**
   * Adds a disabled command to the bot configuration.
   *
   * @param command The command to add to the disabled commands list.
   */
  public async addDisabledCommand(command: string): Promise<BotConfig> {
    const config = await this.getConfig()

    if (!config.disabledCommands) {
      config.disabledCommands = []
    }

    config.disabledCommands.push(command)
    return await this.updateConfigById(config)
  }

  /**
   * Removes a disabled command from the bot configuration.
   *
   * @param command The command to remove from the disabled commands list.
   * @returns The updated BotConfig document.
   */
  public async removeDisabledCommand(command: string): Promise<BotConfig> {
    const config = await this.getConfig()

    if (!config.disabledCommands) {
      return config
    }

    config.disabledCommands = config.disabledCommands.filter((c) => c !== command)
    return await this.updateConfigById(config)
  }

  /**
   * Checks if a command is disabled in the bot configuration.
   *
   * @param command The command to check.
   * @returns `true` if the command is disabled, `false` otherwise.
   */
  public async isCommandDisabled(command: string): Promise<boolean> {
    const config = await this.getConfig()
    return config.disabledCommands?.includes(command) ?? false
  }
}
