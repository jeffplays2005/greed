import type { Client } from "@/types/Client"
import { CacheCollectionKeys } from "@/types/Collection"

const ReadyConfigEvent = async (bot: Client) => {
  // Fetch disabled commands on startup
  const botSettings = await bot.db.botConfig.getConfig()

  bot.cache.set(CacheCollectionKeys.GLOBAL_DISABLED_COMMANDS, botSettings.disabledCommands)
}

export default ReadyConfigEvent
