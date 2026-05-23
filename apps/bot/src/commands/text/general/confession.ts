import type { Confession } from "@repo/shared/payload-types"
import { ContainerBuilder, EmbedBuilder, MessageFlags } from "discord.js"
import ms, { type StringValue } from "ms"
import type { BaseCommandConfig, BaseCommandProps } from "@/types/command"
import { createSimpleEmbed } from "@/utils/embeds"
import { inDms, inGuild } from "@/utils/security"
import { checkMemberPermissions } from "@/utils/security/helpers"

enum ConfessionSubCommand {
  BLACKLIST = "blacklist",
  MUTE = "mute",
  UNMUTE = "unmute",
  COOLDOWN = "cooldown",
  CHANNEL = "channel",
}

const bannedWords = ["bmlnZ2Vy", "dGVzdA=="]

export const run = async ({
  bot,
  message,
  args,
  db,
  color,
  hexColor,
  prefix,
}: BaseCommandProps<true>) => {
  const confessSettings = await db.servers.getServerByDiscordId(bot.config.servers.support[0])
  const subCommand = args[0]

  if (
    subCommand === ConfessionSubCommand.BLACKLIST &&
    inGuild(message) &&
    checkMemberPermissions(message, ["ManageGuild"])
  ) {
    const confessionId = args[1]

    if (confessionId) {
      const confession = await db.confessionMutes.getMuteByConfessionId(confessionId)
      if (!confession)
        return message.reply({
          embeds: [createSimpleEmbed(`confession not found with id \`${confessionId}\``, color)],
          allowedMentions: {},
        })

      const blacklistedConfessionsEmbed = new EmbedBuilder()
        .setAuthor({
          name: "confessions » blacklisted",
          iconURL: message.guild.iconURL() || undefined,
        })
        .setDescription(
          `displaying confession mute details\n\nyou can unmute this confession using \`${prefix}confession unmute ${confessionId}\`\nor you can view all blacklisted confessions using \`${prefix}confession blacklist\``,
        )
        .addFields(
          {
            name: "confession id",
            value: confessionId,
            inline: true,
          },
          {
            name: "reason",
            value: confession.reason,
            inline: true,
          },
          {
            name: "muted by",
            value: confession.mutedBy,
            inline: true,
          },
        )
        .setColor(color)

      return message.reply({
        embeds: [blacklistedConfessionsEmbed],
        allowedMentions: {},
      })
    }

    const blacklistedConfessionsEmbed = new EmbedBuilder()
      .setAuthor({
        name: "confessions » blacklisted",
        iconURL: message.guild.iconURL() || undefined,
      })
      .setDescription(
        `the following confession id's have been muted from posting in **${message.guild.name}**. muting a confession will NOT tell you who posted it.\n\nto get more information on a confession, type \`${prefix}confess blacklist <confession id>\`\nto unmute a confession, type \`${prefix}confession unmute <confession id>\``,
      )
      .setColor(color)

    const blacklistedConfessions = await db.confessionMutes.getServerMutedConfessions(
      message.guild.id,
    )
    if (blacklistedConfessions.length === 0)
      return message.reply({
        embeds: [
          blacklistedConfessionsEmbed.setFooter({
            text: "showing 0-0 of 0 blacklisted confessions",
          }),
        ],
        allowedMentions: {},
      })

    const displayedUsers = blacklistedConfessions.slice(0, 9)
    for (const user of displayedUsers) {
      blacklistedConfessionsEmbed.addFields({
        name: `confession ${(user.confession as Confession).id}`,
        value: `muted by: <@${user.mutedBy}>`,
      })
    }
    blacklistedConfessionsEmbed.setFooter({
      text: `showing 0-${displayedUsers.length} of ${blacklistedConfessions.length} blacklisted confessions`,
    })

    return message.reply({
      embeds: [blacklistedConfessionsEmbed],
      allowedMentions: {},
    })
  }
  if (
    subCommand === ConfessionSubCommand.MUTE &&
    inGuild(message) &&
    checkMemberPermissions(message, ["ManageGuild"])
  ) {
    const confessionId = args[1]
    const reason = args.slice(2).join(" ")
    if (!confessionId)
      return message.reply({
        embeds: [createSimpleEmbed("mention a confession id to mute them!", color)],
        allowedMentions: {},
      })

    const missingReasonEmbed = new EmbedBuilder()
      .setAuthor({
        iconURL: message.guild.iconURL() || undefined,
        name: "confessions mute » error",
        url: "https://discord.gg/xo",
      })
      .setDescription(
        `please provide a reason to mute the person who sent confession \`${confessionId}\`!\n\n**muting will NOT tell you who wrote a confession.** for that reason, please refrain from muting someone without a valid reason — the only good reason to mute someone is if they broke a server rule.\n\nfor example: \`${prefix}confession mute 6a019b94283378c25b971d82 toxic\``,
      )
      .setColor(color)

    if (!reason)
      return message.reply({
        embeds: [missingReasonEmbed],
        allowedMentions: {},
      })

    const fetchedConfession = await db.confessions.getConfessionById(confessionId).catch(() => {})
    if (!fetchedConfession) {
      return message.reply({
        embeds: [createSimpleEmbed(`confession not found with id \`${confessionId}\``, color)],
        allowedMentions: {},
      })
    }

    const isMuted = await db.confessionMutes.getMuteByConfessionId(confessionId)
    if (isMuted) {
      return message.reply({
        embeds: [createSimpleEmbed(`confession \`${confessionId}\` is already muted!`, color)],
        allowedMentions: {},
      })
    }

    await db.confessionMutes.muteConfession({
      confession: confessionId,
      userId: fetchedConfession.userId || "",
      serverId: message.guild.id,
      mutedBy: message.author.id,
      reason,
    })

    try {
      const user = message.guild.members.cache.get(fetchedConfession.userId || "")
      if (user) {
        user.send({
          embeds: [
            createSimpleEmbed(
              `you have been muted from anonymous confessions in **${message.guild.name}**`,
              color,
            )
              .setAuthor({
                iconURL: message.guild.iconURL() || undefined,
                name: "confessions » muted",
                url: "https://discord.gg/xo",
              })
              .addFields({
                name: "reason",
                value: reason,
              })
              .setTimestamp(),
          ],
          allowedMentions: {},
        })
      }
    } catch (_) {}

    const mutedEmbed = new EmbedBuilder()
      .setAuthor({
        iconURL: message.guild.iconURL() || undefined,
        name: "confessions » mute",
        url: "https://discord.gg/xo",
      })
      .setDescription(
        `${message.author}, you successfully muted anonymous confession ${confessionId}\n\nif that user is still in this server, i told them they can no longer confess here.`,
      )
      .addFields({
        name: "reason",
        value: reason,
      })
      .setColor(color)
      .setTimestamp()

    return message.reply({
      embeds: [mutedEmbed],
      allowedMentions: {},
    })
  }
  if (
    subCommand === ConfessionSubCommand.UNMUTE &&
    inGuild(message) &&
    checkMemberPermissions(message, ["ManageGuild"])
  ) {
    const confessionId = args[1]
    if (!confessionId)
      return message.reply({
        embeds: [createSimpleEmbed("mention a confession id to unmute them!", color)],
        allowedMentions: {},
      })

    const fetchedConfession = await db.confessions.getConfessionById(confessionId).catch(() => {})
    if (!confessionId || !fetchedConfession) {
      return message.reply({
        embeds: [createSimpleEmbed(`confession not found with id \`${confessionId}\``, color)],
        allowedMentions: {},
      })
    }

    const isMuted = await db.confessionMutes.getMuteByConfessionId(confessionId)
    if (!isMuted) {
      return message.reply({
        embeds: [createSimpleEmbed(`confession \`${confessionId}\` is not muted!`, color)],
        allowedMentions: {},
      })
    }

    await db.confessionMutes.unmuteConfession(confessionId)

    try {
      const user = message.guild.members.cache.get(fetchedConfession.userId || "")
      if (user) {
        user.send({
          embeds: [
            createSimpleEmbed(
              `you have been unmuted from anonymous confessions in **${message.guild.name}**`,
              color,
            )
              .setAuthor({
                iconURL: message.guild.iconURL() || undefined,
                name: "confessions » muted",
                url: "https://discord.gg/xo",
              })
              .setTimestamp(),
          ],
          allowedMentions: {},
        })
      }
    } catch (_) {}

    const unmuteEmbed = new EmbedBuilder()
      .setAuthor({
        name: "confessions » unmute",
        url: "https://discord.gg/xo",
        iconURL: message.guild.iconURL() || undefined,
      })
      .setDescription(
        `${message.author}, you successfully unmuted anonymous confession \`${confessionId}\`\n\nif that user is still in this server, i told them they can now post confessions here again.`,
      )
      .setColor(color)
      .setTimestamp()

    return message.reply({
      embeds: [unmuteEmbed],
      allowedMentions: {},
    })
  }
  if (
    subCommand === ConfessionSubCommand.COOLDOWN &&
    inGuild(message) &&
    checkMemberPermissions(message, ["ManageGuild"])
  ) {
    // default is 5 minutes
    const newCooldown = args[1] as StringValue

    if (!newCooldown || !ms(newCooldown)) {
      return message.reply({
        embeds: [
          createSimpleEmbed("please provide a valid cooldown time! e.g. `5 minutes`", color),
        ],
        allowedMentions: {},
      })
    }

    const settings = await db.servers.getOrCreateServerByDiscordId(message.guild.id)

    await db.servers.updateServerById(settings.id, {
      confessionSettings: {
        cooldownSeconds: ms(newCooldown) / 1000,
      },
    })

    return message.reply({
      embeds: [createSimpleEmbed(`cooldown updated to \`${newCooldown}\``, color)],
      allowedMentions: {},
    })
  }
  if (
    subCommand === ConfessionSubCommand.CHANNEL &&
    inGuild(message) &&
    checkMemberPermissions(message, ["ManageGuild"])
  ) {
    const channel = message.mentions.channels.first()
    if (!channel) {
      return message.reply({
        embeds: [createSimpleEmbed("please provide a valid channel!", color)],
        allowedMentions: {},
      })
    }

    const settings = await db.servers.getOrCreateServerByDiscordId(message.guild.id)

    await db.servers.updateServerById(settings.id, {
      confessionSettings: {
        channel: channel.id,
      },
    })

    return message.reply({
      embeds: [createSimpleEmbed(`channel updated to <#${channel.id}>`, color)],
      allowedMentions: {},
    })
  }

  const isMuted = await db.confessionMutes.isUserMutedInServer(
    message.author.id,
    bot.config.servers.support[0],
  )

  if (isMuted && inDms(message)) {
    return message.reply({
      embeds: [
        createSimpleEmbed("you are muted from anonymous confessions in **xo**!", color)
          .setAuthor({
            iconURL: message.author.avatarURL() || undefined,
            name: "confessions » muted",
            url: "https://discord.gg/xo",
          })
          .setTimestamp(),
      ],
      allowedMentions: {},
    })
  }

  const helpContainer = new ContainerBuilder()
    .setAccentColor(hexColor)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `### :question: confession help\n\ndm me to share truly anonymous confessions with other people in your server 👀\n\n**confessions are 100% anonymous and no staff members can see what you wrote.** muting does not reveal who wrote a confession.\n### usage\n\`${prefix}confession <message | image>\``,
      ),
    )

  const confession = args.join(" ")
  if (!confession && !message.attachments.size)
    return message.reply({
      components: [helpContainer],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: {},
    })

  if (inGuild(message)) {
    await message.delete().catch(() => {})
    return message.channel.send({
      components: [helpContainer],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: {},
    })
  }

  const cooldown = bot.cooldownManager.isOnCooldown(message.author.id, "confession-create")
  if (cooldown) {
    return message.reply({
      embeds: [
        createSimpleEmbed(
          `you are on cooldown for posting confessions, you can send another <t:${Math.floor(cooldown / 1000)}:R>`,
          color,
        ),
      ],
      allowedMentions: {},
    })
  }

  const confessionChannel = bot.channels.cache.get(
    confessSettings?.confessionSettings?.channel || "",
  )
  if (!confessionChannel || !confessionChannel.isSendable())
    return message.reply({
      embeds: [createSimpleEmbed("confession channel not set! please try again later", color)],
      allowedMentions: {},
    })

  const confessionEmbed = new EmbedBuilder()
    .setAuthor({
      name: "anonymous confession",
      iconURL:
        "https://media.discordapp.net/attachments/883163631527817276/1495771346687234089/Screenshot_2026-04-21_at_1.01.05_AM.png?ex=69e7751f&is=69e6239f&hm=827d215270def1e20bdf539822dcac99dfb782099d760de1d3b315ad13d5c3ef&=&quality=lossless",
    })
    .setColor(color)
    .setTimestamp()

  // Check for image or description
  if (message.attachments.size > 0) {
    const attachment = message.attachments.first()
    if (attachment) {
      confessionEmbed.setImage(attachment.url)

      return message.channel.send({
        embeds: [createSimpleEmbed("our devs are working hard on enabling attachments!", color)],
      })
    }
  } else {
    if (
      bannedWords.some((b64) =>
        confession.toLowerCase().includes(Buffer.from(b64, "base64").toString()),
      )
    ) {
      const confessionRecord = await db.confessions.createConfession({
        userId: message.author.id,
        serverId: bot.config.servers.support[0],
      })

      await db.confessionMutes.muteConfession({
        confession: confessionRecord.id,
        userId: message.author.id,
        serverId: bot.config.servers.support[0],
        mutedBy: message.author.id,
        reason: "automod ban for slur",
      })

      return message.reply({
        embeds: [
          createSimpleEmbed("you have been muted from anonymous confessions in **xo**", color)
            .setAuthor({
              iconURL: bot.guilds.cache.get(bot.config.servers.support[0])?.iconURL() || undefined,
              name: "confessions » muted",
              url: "https://discord.gg/xo",
            })
            .addFields({
              name: "reason",
              value: "automod ban for slur",
            })
            .setTimestamp(),
        ],
        allowedMentions: {},
      })
    }
    confessionEmbed.setDescription(confession)
  }

  // Set cooldown earlier to avoid users double sending
  bot.cooldownManager.setCooldown(
    message.author.id,
    "confession-create",
    confessSettings?.confessionSettings?.cooldownSeconds ?? 300,
  )

  const confessionRecord = await db.confessions.createConfession({
    userId: message.author.id,
    serverId: bot.config.servers.support[0],
  })

  confessionEmbed.setFooter({
    text: `dm me \`${prefix}confess\` to send a confession • id: ${confessionRecord.id}`,
  })

  await confessionChannel.send({ embeds: [confessionEmbed] })

  const confessionConfirmationEmbed = new EmbedBuilder()
    .setDescription(
      `${message.author}, your anonymous confession was successfully posted to **xo**!`,
    )
    .addFields(
      {
        name: "channel",
        value: `${confessionChannel}`,
        inline: true,
      },
      {
        name: "anonymous confession id",
        value: `${confessionRecord.id}`,
        inline: true,
      },
    )
    .setColor(color)
    .setTimestamp()

  return message.reply({
    embeds: [confessionConfirmationEmbed],
    allowedMentions: {},
  })
}

export const config: BaseCommandConfig = {
  name: "confession",
  description:
    "dm me to share truly anonymous confessions with other people in your server 👀\n\n**confessions are 100% anonymous and no staff members can see what you wrote.** muting does not reveal who wrote a confession.",
  aliases: ["confess"],
  usage: [
    "confession <description|image>",
    "confession blacklist",
    "confession mute <user>",
    "confession unmute <user>",
    "confession cooldown <cooldown>",
    "confession channel <channel>",
  ],
}
