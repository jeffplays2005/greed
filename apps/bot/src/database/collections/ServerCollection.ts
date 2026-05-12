import type { Confession, Server } from "@repo/shared/payload-types"
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

  /**
   * Confession update methods
   */

  /**
   * Retrieves the muted confessions for a server.
   *
   * @param serverId The ID of the server to retrieve confessions for.
   * @returns The muted confessions for the server.
   */
  public async getServerConfessions(serverId: string): Promise<(Confession | string)[]> {
    return (
      (
        await this.db.find({
          collection: "servers",
          where: {
            serverId: {
              equals: serverId,
            },
          },
        })
      ).docs[0].confessionSettings?.mutedConfessions ?? []
    )
  }

  /**
   * Checks if a confession is muted on a server.
   *
   * @param serverId The ID of the server to check.
   * @param confessionId The ID of the confession to check.
   * @returns A promise that resolves to `true` if the confession is muted, `false` otherwise.
   */
  public async checkServerConfessions(serverId: string, confessionId: string): Promise<boolean> {
    return (
      (
        await this.db.find({
          collection: "servers",
          where: {
            serverId: {
              equals: serverId,
            },
            "confessionSettings.mutedConfessions": {
              contains: confessionId,
            },
          },
        })
      ).docs.length > 0
    )
  }

  /**
   * Removes a muted confession from a server.
   *
   * @param serverId The ID of the server to remove the confession from.
   * @param confessionId The ID of the confession to remove.
   * @returns A promise that resolves when the confession is removed.
   */
  public async addMutedConfession(serverId: string, confessionId: string): Promise<Server | null> {
    const server = await this.getServerByDiscordId(serverId)
    if (!server) return null
    return await this.updateServer(server.id, {
      confessionSettings: {
        mutedConfessions: [...(server.confessionSettings?.mutedConfessions ?? []), confessionId],
      },
    })
  }

  /**
   * Removes a muted confession from a server.
   *
   * @param serverId The ID of the server to remove the confession from.
   * @param confessionId The ID of the confession to remove.
   * @returns A promise that resolves when the confession is removed.
   */
  public async removeMutedConfession(
    serverId: string,
    confessionId: string,
  ): Promise<Server | null> {
    const server = await this.getServerByDiscordId(serverId)
    if (!server) return null

    const confessions = (server.confessionSettings?.mutedConfessions || []) as Confession[]

    return await this.updateServer(server.id, {
      confessionSettings: {
        mutedConfessions: confessions.filter((confession) => confession?.id !== confessionId),
      },
    })
  }
}
