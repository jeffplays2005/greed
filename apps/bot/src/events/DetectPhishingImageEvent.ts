import type { Message } from "discord.js"
import type { Client } from "@/types/Client"
import PhishingImgHelper from "@/utils/phishing-img-helper"
import { checkMemberPermissions } from "@/utils/security/helpers"

/**
 * Detects phishing images in messages and takes appropriate actions.
 *
 * @param message The message to check for phishing images.
 * @param bot The bot client instance.
 */
const DetectPhishingImageEvent = async (message: Message, bot: Client) => {
  if (!message.guild || message.author.bot) return
  if (message.attachments.size === 0) return
  // avoid kicking auditors
  if (checkMemberPermissions(message, ["ManageMessages"])) return

  for (const attachment of message.attachments.values()) {
    if (attachment.contentType?.startsWith("image/")) {
      const imageUrl = attachment.url

      // Get image hash
      const imageHash = await PhishingImgHelper.getImgHash(imageUrl)
      if (!imageHash) return

      // Check if image hash matches any known phishing image
      const settings = await bot.db.servers.getServerByDiscordId(message.guild.id)
      if (!settings || !settings.phishingImageSettings?.bannedImages?.length) return

      const phishingImageSettings = settings.phishingImageSettings
      const bannedImages = phishingImageSettings.bannedImages || []
      const defaultAction = phishingImageSettings.defaultAction || "BAN"
      if (bannedImages.some((image) => image.imageHash === imageHash)) {
        try {
          await message.delete()

          // Check for default action
          switch (defaultAction) {
            case "BAN":
              message.member?.ban({ reason: "Phishing image detected" }).catch(() => {})
              break
            case "KICK":
              message.member?.kick("Phishing image detected").catch(() => {})
              break
            case "DELETE":
              break
            case "LOG":
              console.log("phishing img detected")
              break
          }
        } catch (_) {}
      }
    }
  }
}

export default DetectPhishingImageEvent
