import { type ColorResolvable, EmbedBuilder } from "discord.js"

/**
 * A simple embed builder that creates an embed with a description and color.
 *
 * @param description The description to put in the embed
 * @param color The color of the embed
 * @returns The embed
 */
export function createSimpleEmbed(description: string, color: ColorResolvable): EmbedBuilder {
  return new EmbedBuilder().setDescription(description).setColor(color)
}
