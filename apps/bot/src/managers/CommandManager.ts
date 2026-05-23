import fs from "node:fs"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { Collection, type User } from "discord.js"
import type { Client } from "@/types/Client"
import { CacheCollectionKeys } from "@/types/Collection"
import type { CommandModule } from "@/types/command/Command"
import { CooldownHelper } from "@/utils/cooldowns"

/**
 * Manages the command collection for the bot.
 *
 * @param bot The base discord client
 */
const CommandManager = (bot: Client) => {
  bot.commands = new Collection<string, CommandModule>()
  bot.aliases = new Collection<string, string>()
  // Cooldowns
  bot.cooldowns = new Collection<`${User["id"]}:${string}`, number>()
  bot.cooldownManager = new CooldownHelper(bot.cooldowns)

  // Enables common js method of pathing
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  fs.readdir(`${__dirname}/../commands/text`, (error, files) => {
    if (error) console.log(error)

    const folders = files.filter((file) => file.split(".").pop() === file)
    // TODO: replace console.log with proper logging later
    if (!folders.length) return console.log("[LOGS][Bot] Couldn't find any command folders!")
    bot.cache.set(CacheCollectionKeys.COMMAND_FOLDERS, folders)

    const categoryCommandMapping = new Map<string, string[]>()

    folders.forEach((folder) => {
      fs.readdir(`${__dirname}/../commands/text/${folder}`, (error, files) => {
        if (error) console.log(error)

        const commandFiles = files.filter((file) => file.split(".").pop() === "ts")

        // Store the files and folder into the command mapping for help command
        categoryCommandMapping.set(
          folder,
          commandFiles.map((file) => file.split(".")[0]),
        )

        if (!commandFiles.length)
          return console.log(`[LOGS][Bot] Couldn't find text.${folder} commands!`)

        commandFiles.forEach((file) => {
          import(`${__dirname}/../commands/text/${folder}/${file}`).then(
            (pulledFile: CommandModule) => {
              bot.commands.set(pulledFile.config.name, {
                config: pulledFile.config,
                run: pulledFile.run,
              })
              pulledFile.config.aliases?.forEach((alias: string) => {
                bot.aliases.set(alias, pulledFile.config.name)
              })
            },
          )
        })
      })
    })

    bot.cache.set(CacheCollectionKeys.FOLDER_MAPPING, categoryCommandMapping)
  })
}

export default CommandManager
