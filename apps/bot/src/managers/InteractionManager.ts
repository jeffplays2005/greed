import fs from "node:fs"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { Collection } from "discord.js"
import type { Client } from "@/types/Client"
import type { ButtonModule } from "@/types/interactions"

/**
 * Manages the interaction collection for the bot.
 *
 * @param bot The base discord client
 */
const InteractionManager = (bot: Client) => {
  bot.buttons = new Collection<string, ButtonModule>()

  // Enables common js method of pathing
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  /**
   * Used to handle processing buttons in particular
   */
  fs.readdir(`${__dirname}/../commands/buttons`, (error, files) => {
    if (error) console.log(error)

    const folders = files.filter((file) => !file.includes("."))

    if (!folders.length) return console.log("[LOGS][Bot] Couldn't find any button folders!")

    folders.forEach((folder) => {
      fs.readdir(`${__dirname}/../commands/buttons/${folder}`, (error, files) => {
        if (error) console.log(error)

        const interactionFiles = files.filter((file) => file.split(".").pop() === "ts")

        if (!interactionFiles.length) {
          return console.log(`[LOGS][Bot] Couldn't find buttons in ${folder}!`)
        }

        interactionFiles.forEach((file) => {
          import(`${__dirname}/../commands/buttons/${folder}/${file}`).then(
            (pulledFile: ButtonModule) => {
              bot.buttons.set(pulledFile.config.name, {
                run: pulledFile.run,
                config: pulledFile.config,
              })
            },
          )
        })
      })
    })
  })
}

export default InteractionManager
