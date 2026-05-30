import { payload } from "./adapters/Payload"
import { ConfessionCollection } from "./collections/ConfessionCollection"
import { ConfessionMutesCollection } from "./collections/ConfessionMutesCollection"
import { ServerCollection } from "./collections/ServerCollection"
import { UserCollection } from "./collections/UserCollection"
import { BotConfigCollection } from "./globals/BotConfigCollection"

export const db = {
  users: new UserCollection(payload),
  confessions: new ConfessionCollection(payload),
  servers: new ServerCollection(payload),
  confessionMutes: new ConfessionMutesCollection(payload),
  // Globals
  botConfigs: new BotConfigCollection(payload),
}
