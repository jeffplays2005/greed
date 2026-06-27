import {
  Collection,
  Events,
  type GuildBasedChannel,
  type GuildMember,
  type Message,
  type OmitPartialGroupDMChannel,
  type Role,
  type User,
} from "discord.js"
import { InternalPermissions } from "@/types/Config"
import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"
import { getMember } from "@/utils/parsers"

export const run = async ({ bot, message, args, color, prefix }: BaseCommandProps) => {
  const member = getMember({ message, toFind: args[0], excludeSelf: true })

  if (!member) {
    await message.reply({
      embeds: [createSimpleEmbed("you must mention a valid user!", color)],
      allowedMentions: {},
    })
    return
  }

  const commandName = args[1]?.toLowerCase()
  if (!commandName) {
    await message.reply({
      embeds: [
        createSimpleEmbed(
          `please provide a command to execute. usage: \`${prefix}execute <user> <command>\``,
          color,
        ),
      ],
      allowedMentions: {},
    })
    return
  }

  if (commandName === config.name || config.aliases?.includes(commandName)) {
    await message.reply({
      embeds: [createSimpleEmbed("you cannot execute the execute command.", color)],
      allowedMentions: {},
    })
    return
  }

  const commandModule =
    bot.commands.get(commandName) ?? bot.commands.get(bot.aliases.get(commandName) ?? "")
  if (!commandModule) {
    await message.reply({
      embeds: [createSimpleEmbed(`command \`${commandName}\` not found.`, color)],
      allowedMentions: {},
    })
    return
  }

  if (!message.inGuild() || !message.guild) {
    await message.reply({
      embeds: [createSimpleEmbed("this command can only be used in servers!", color)],
      allowedMentions: {},
    })
    return
  }

  const proxiedMessage = Object.create(message) as Message
  Object.defineProperty(proxiedMessage, "author", { value: member.user })
  Object.defineProperty(proxiedMessage, "member", { value: member })
  Object.defineProperty(proxiedMessage, "content", {
    value: `${prefix}${commandName} ${args.slice(2).join(" ")}`.trim(),
  })

  const commandText = args.slice(2).join(" ")
  const mentionedUserIds = new Set<string>()
  const mentionedChannelIds = new Set<string>()
  const mentionedRoleIds = new Set<string>()

  for (const match of commandText.matchAll(/<@!?(\d+)>/g)) {
    mentionedUserIds.add(match[1])
  }
  for (const match of commandText.matchAll(/<#(\d+)>/g)) {
    mentionedChannelIds.add(match[1])
  }
  for (const match of commandText.matchAll(/<@&(\d+)>/g)) {
    mentionedRoleIds.add(match[1])
  }

  const mentionedUsers = new Collection<string, User>()
  const mentionedMembers = new Collection<string, GuildMember>()
  const mentionedChannels = new Collection<string, GuildBasedChannel>()
  const mentionedRoles = new Collection<string, Role>()

  for (const id of mentionedUserIds) {
    const fetchedUser = bot.users.cache.get(id) ?? (await bot.users.fetch(id).catch(() => null))
    if (fetchedUser) {
      mentionedUsers.set(id, fetchedUser)
    }

    const fetchedMember =
      message.guild.members.cache.get(id) ??
      (await message.guild.members.fetch(id).catch(() => null))
    if (fetchedMember) {
      mentionedMembers.set(id, fetchedMember)
    }
  }

  for (const id of mentionedChannelIds) {
    const fetchedChannel =
      message.guild.channels.cache.get(id) ??
      (await message.guild.channels.fetch(id).catch(() => null))
    if (fetchedChannel) {
      mentionedChannels.set(id, fetchedChannel)
    }
  }

  for (const id of mentionedRoleIds) {
    const fetchedRole = message.guild.roles.cache.get(id)
    if (fetchedRole) {
      mentionedRoles.set(id, fetchedRole)
    }
  }

  Object.defineProperty(proxiedMessage, "mentions", {
    value: {
      users: mentionedUsers,
      members: mentionedMembers,
      channels: mentionedChannels,
      roles: mentionedRoles,
    },
  })

  const emittedMessage = proxiedMessage as OmitPartialGroupDMChannel<Message<true>>
  bot.emit(Events.MessageCreate, emittedMessage)
}

export const config: BaseCommandConfig = {
  name: "execute",
  description: "command to help developers test execute a command on the bot",
  usage: ["<user> <command>"],
  aliases: ["exec"],
  dev: true,
  permissionSet: {
    guildOnly: true,
    internalPermissions: [InternalPermissions.OWNERS],
  },
}
