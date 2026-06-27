import { imageHash } from "@repo/image-hash"
import { type Attachment, AttachmentBuilder, type Message } from "discord.js"
import type { Client } from "@/types/Client"

const PhishingImgHelper = {
  /**
   * Gets the hash of an image from its URL using image-hash.
   *
   * @param imageURL The URL of the image to hash.
   * @returns The hash of the image as a string, or an empty string if an error occurs.
   */
  getImgHash(imageURL: string): Promise<string> {
    return new Promise((resolve) => {
      imageHash(imageURL, 16, true, (error: Error | null, data: string) => {
        if (error) {
          console.error(error)
          resolve("")
          return
        }

        resolve(data)
      })
    })
  },

  /**
   * Uploads an image to the phishing image upload channel.
   *
   * @param bot The bot client.
   * @param imageName The name of the image file.
   * @param imageURL The URL of the image to upload.
   * @returns The message containing the uploaded image, or undefined if the channel is not sendable.
   */
  async uploadImg(bot: Client, imageURL: string): Promise<Message | undefined> {
    const attachment = new AttachmentBuilder(imageURL)
    const uploadChannel = bot.channels.cache.get(bot.config.channels.phishingImgUpld)

    if (!uploadChannel || !uploadChannel.isSendable()) return

    const msg = await uploadChannel.send({ files: [attachment] })
    return msg
  },

  /**
   * Fetches an image from the phishing image upload channel.
   *
   * @param bot The bot client.
   * @param messageId The ID of the message containing the image.
   * @returns The attachment of the image, or undefined if the channel is not sendable or the message is not found.
   */
  async fetchImg(bot: Client, messageId: string): Promise<Attachment | undefined> {
    const channel = bot.channels.cache.get(bot.config.channels.phishingImgUpld)
    if (!channel || !channel.isSendable()) return

    // fetch message first
    await channel.messages.fetch(messageId)
    const message = channel.messages.cache.get(messageId)

    if (!message) return

    return message.attachments.first()
  },
}
export default PhishingImgHelper
