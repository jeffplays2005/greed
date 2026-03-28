import { Collection, Client as DiscordClient, IntentsBitField, type User } from "discord.js"
import "dotenv/config"
import { Config } from "./config"
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
}) as Client

bot.cache = new Collection<CacheCollectionKeys, unknown>()
bot.cooldowns = new Collection<`${User["id"]}:${string}`, number>()
bot.config = Config

EventManager(bot)
CommandManager(bot)

bot.login(process.env.BOT_TOKEN)
