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
}
