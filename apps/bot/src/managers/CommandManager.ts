import fs from "node:fs"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { Collection } from "discord.js"
import type { Client } from "src/types/Client"
import { CacheCollectionKeys } from "src/types/Collection"

/**
 * Manages the command collection for the bot.
 *
 * @param bot The base discord client
 */
const CommandManager = (bot: Client) => {
  bot.interactions = new Collection<string, unknown>()
  bot.commands = new Collection<string, unknown>()
  bot.aliases = new Collection<string, unknown>()

  // Enables common js method of pathing
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  fs.readdir(`${__dirname}/../commands/text`, (error, files) => {
    if (error) console.log(error)

    const folders = files.filter((file) => file.split(".").pop() === file)
    // TODO: replace console.log with proper logging later
    if (!folders.length) return console.log("[LOGS][Bot] Couldn't find any command folders!")
    bot.cache?.set(CacheCollectionKeys.COMMAND_FOLDERS, folders)

    folders.forEach((folder) => {
      fs.readdir(`${__dirname}/../commands/text/${folder}`, (error, files) => {
        if (error) console.log(error)

        const commandFiles = files.filter((file) => file.split(".").pop() === "ts")
        if (!commandFiles.length)
          return console.log(`[LOGS][Bot] Couldn't find text.${folder} commands!`)

        commandFiles.forEach((file) => {
          import(`${__dirname}/../commands/text/${folder}/${file}`).then((pulledFile) => {
            bot.commands?.set(pulledFile.config.name, pulledFile)
            pulledFile.config.aliases.forEach((alias: string) => {
              bot.aliases?.set(alias, pulledFile.config.name)
            })
          })
        })
      })
    })
  })
}

export default CommandManager
