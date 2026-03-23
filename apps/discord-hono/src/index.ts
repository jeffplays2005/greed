import { DiscordHono } from "discord-hono"

// import UserDataService from "./data-layer/services/UserDataService"

const app = new DiscordHono()

app.command("ping", (c) => c.res("Pong!!"))
app.command("bal", async (c) => {
  return c.res(`DEBUG: ${c.interaction.member?.user.id} ${c.interaction.channel.id}`)
  // if (c.interaction.user?.id) {
  //   const user = await new UserDataService().setUserData(c.interaction.user.id, { balance: 100 })
  //   c.res(JSON.stringify(user))
  // }
  // const amt = await new UserDataService().getUserData(c.interaction.user?.id || "")
  // console.log(amt)
  // return c.res(`Your balance is ${amt?.balance || 0}`)
})

export default app
