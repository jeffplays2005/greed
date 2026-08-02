import type { Server } from "@repo/shared/payload-types"
import type { Payload } from "payload"

export class ServerCollection {
  private db: Payload

  constructor(db: Payload) {
    this.db = db
  }

  /**
   * Creates a new server record in the database.
   *
   * @param data The server data to create.
   * @returns The created server.
   */
  public async createServer(data: Omit<Server, "id" | "createdAt" | "updatedAt">): Promise<Server> {
    return this.db.create({
      collection: "servers",
      data,
    })
  }

  /**
   * Retrieves a server by its Discord ID.
   *
   * @param discordId The Discord ID of the server.
   * @returns The server, or null if not found.
   */
  public async getServerByDiscordId(discordId: string): Promise<Server | null> {
    return (
      await this.db.find({
        collection: "servers",
        where: {
          serverId: {
            equals: discordId,
          },
        },
        limit: 1,
      })
    ).docs[0]
  }

  /**
   * Retrieves servers that need to be bumped (i.e., whose next bump date is in the past).
   *
   * @returns An array of servers that need to be bumped.
   */
  public async getServersToBump(): Promise<Server[]> {
    return (
      await this.db.find({
        collection: "servers",
        where: {
          "bumpInfo.nextBump": {
            less_than: new Date().toISOString(),
          },
        },
        pagination: false,
      })
    ).docs
  }

  /**
   * Retrieves a server by its Discord ID, or creates it if it doesn't exist.
   *
   * @param discordId The Discord ID of the server.
   * @returns The server.
   */
  public async getOrCreateServerByDiscordId(discordId: string): Promise<Server> {
    const existing = await this.getServerByDiscordId(discordId)
    if (existing) return existing
    return this.createServer({ serverId: discordId })
  }

  /**
   * Updates a server by its ID.
   *
   * @param serverId The ID of the server to update.
   * @param data The partial data to update.
   * @returns The updated server.
   */
  public async updateServerById(
    serverId: string,
    data: Partial<Omit<Server, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Server> {
    return this.db.update({
      collection: "servers",
      id: serverId,
      data,
    })
  }

  /**
   * Adds a phishing image to the server's phishing image settings.
   *
   * @param serverId The ID of the server to add the image to.
   * @param description The description of the image.
   * @param imageHash The hash of the image.
   * @param imageUrl The URL of the image.
   * @returns The updated server.
   */
  public async addPhishingImage(
    serverId: string,
    description: string,
    imageHash: string,
    imageUrl: string,
    bannedBy: string,
  ): Promise<Server> {
    const server = await this.getOrCreateServerByDiscordId(serverId)

    const phishingImageSettings = server.phishingImageSettings || { bannedImages: [] }
    phishingImageSettings.bannedImages?.push({
      description,
      imageHash,
      imageUrl,
      bannedBy,
    })

    return await this.updateServerById(server.id, { phishingImageSettings })
  }

  /**
   * Removes a phishing image from the server's phishing image settings.
   *
   * @param serverId The Discord ID of the server to remove the image from.
   * @param imageId The Payload row ID of the image to remove.
   * @returns The updated server.
   */
  public async removePhishingImage(serverId: string, imageId: string): Promise<Server> {
    const server = await this.getOrCreateServerByDiscordId(serverId)
    const phishingImageSettings = server.phishingImageSettings || { bannedImages: [] }

    phishingImageSettings.bannedImages =
      phishingImageSettings.bannedImages?.filter((image) => image.id !== imageId) ?? []

    return await this.updateServerById(server.id, { phishingImageSettings })
  }
}
