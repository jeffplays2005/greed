import { Command, register } from "discord-hono"

const commands = [
  new Command("ping", "Replies with Pong!"),
  new Command("bal", "check a users balance"),
]

register(
  commands,
  process.env.DISCORD_APPLICATION_ID,
  process.env.DISCORD_TOKEN,
  // process.env.DISCORD_TEST_GUILD_ID,
)
