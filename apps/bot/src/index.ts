import { Client as DiscordClient, GatewayIntentBits } from "discord.js"
import "dotenv/config"
import EventManager from "./managers/EventManager"
import type { Client } from "./types/Client"

const bot: Client = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

EventManager(bot)

bot.login(process.env.BOT_TOKEN)
