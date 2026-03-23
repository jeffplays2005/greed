import type { Client } from "discord.js"

const ReadyEvent = (bot: Client) => {
  console.log(`Ready! Logged in as ${bot.user?.tag}`)

  bot.user?.setActivity({
    name: "/xo",
  })
}

export default ReadyEvent
