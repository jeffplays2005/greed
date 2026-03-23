import { Client, GatewayIntentBits } from "discord.js"
import "dotenv/config"
import EventManager from "./managers/EventManager"

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

EventManager(bot)

bot.login(process.env.BOT_TOKEN)
