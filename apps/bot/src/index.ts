import { Collection, Client as DiscordClient, GatewayIntentBits } from "discord.js"
import "dotenv/config"
import { Config } from "./config"
import CommandManager from "./managers/CommandManager"
import EventManager from "./managers/EventManager"
import type { Client } from "./types/Client"
import type { CacheCollectionKeys } from "./types/Collection"

const bot: Client = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
})

bot.cache = new Collection<CacheCollectionKeys, unknown>()
bot.config = Config

EventManager(bot)
CommandManager(bot)

bot.login(process.env.BOT_TOKEN)
