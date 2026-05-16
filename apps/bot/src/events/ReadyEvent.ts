import type { Client } from "discord.js"

const ReadyEvent = (bot: Client) => {
  console.log(`Ready! Logged in as ${bot.user?.tag}`)

  bot.user?.setPresence({
    status: "dnd",
    activities: [{ name: "/xo" }],
  })

  setInterval(() => {
    bot.user?.setPresence({
      status: "dnd",
      activities: [{ name: "/xo" }],
    })
  }, 60_000)
}

export default ReadyEvent
