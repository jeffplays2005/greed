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
  public async updateServer(
    serverId: string,
    data: Partial<Omit<Server, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Server> {
    return this.db.update({
      collection: "servers",
      id: serverId,
      data,
    })
  }
}
