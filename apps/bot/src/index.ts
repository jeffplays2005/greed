import { Collection, Client as DiscordClient, IntentsBitField, Partials } from "discord.js"
import "dotenv/config"
import { Config } from "./config"
import { payload } from "./database/adapters/Payload"
import { db } from "./database/collections"
import CommandManager from "./managers/CommandManager"
import EventManager from "./managers/EventManager"
import type { Client } from "./types/Client"
import type { CacheCollectionKeys } from "./types/Collection"

const bot = new DiscordClient({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.User],
}) as Client

bot.cache = new Collection<CacheCollectionKeys, unknown>()
bot.config = Config
bot.payload = payload
bot.db = db

EventManager(bot)
CommandManager(bot)

bot.login(process.env.BOT_TOKEN)
