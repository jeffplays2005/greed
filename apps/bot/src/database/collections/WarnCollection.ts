import type { Warn } from "@repo/shared/payload-types"
import type { Payload, Where } from "payload"

export class WarnCollection {
  private db: Payload

  constructor(db: Payload) {
    this.db = db
  }

  /**
   * Creates a new warn for the specified user on the specified server.
   *
   * @param data The data for the warn to be created.
   * @returns The created warn.
   */
  public async createWarn(data: Omit<Warn, "id" | "createdAt" | "updatedAt">): Promise<Warn> {
    return this.db.create({
      collection: "warns",
      data,
    })
  }

  /**
   * Retrieves the warns for the specified user on the specified server.
   *
   * @param serverId The ID of the server to get warns for.
   * @param userId The ID of the user to get warns for.
   * @param filters Optional filters to apply to the warns query.
   * @returns The user's warns on the server.
   */
  public async getServerWarns(
    serverId: string,
    userId?: string,
    filters: {
      olderThan?: number
      newerThan?: number
      final?: boolean
    } = {},
  ): Promise<Warn[]> {
    const where: Where = {
      server: {
        equals: serverId,
      },
    }

    if (userId) {
      where.to = {
        equals: userId,
      }
    }

    if (filters.olderThan) {
      where.createdAt = {
        less_than: new Date(filters.olderThan).toISOString(),
      }
    }

    if (filters.newerThan) {
      where.createdAt = {
        ...where.createdAt,
        greater_than: new Date(filters.newerThan).toISOString(),
      }
    }

    if (filters.final) where.final = { equals: true }

    return (
      await this.db.find({
        collection: "warns",
        where,
        sort: "-createdAt",
        depth: 1,
        pagination: false,
      })
    ).docs
  }

  /**
   * Checks if the specified user has a final warn on the specified server.
   *
   * @param serverId The ID of the server to check.
   * @param userId The ID of the user to check.
   * @returns Whether the user has a final warn on the server.
   */
  public async hasFinalWarn(serverId: string, userId: string): Promise<boolean> {
    const result = await this.db.find({
      collection: "warns",
      where: {
        server: {
          equals: serverId,
        },
        to: {
          equals: userId,
        },
        final: {
          equals: true,
        },
      },
      limit: 1,
    })

    return result.docs.length > 0
  }

  /**
   * Clears all warns for the specified user on the specified server.
   *
   * @param serverId The ID of the server to clear warns for.
   * @param userId The ID of the user to clear warns for.
   * @returns The cleared warns.
   */
  public async clearUserWarns(serverId: string, userId: string) {
    return this.db.delete({
      collection: "warns",
      where: {
        server: {
          equals: serverId,
        },
        to: {
          equals: userId,
        },
      },
    })
  }

  /**
   * Removes a warning by ID if it belongs to the specified server.
   *
   * @param serverId The ID of the server the warning must belong to.
   * @param warningId The ID of the warning to remove.
   * @returns The removed warning, or `undefined` if no matching warning exists.
   */
  public async removeServerWarn(serverId: string, warningId: string): Promise<Warn | undefined> {
    const result = await this.db.delete({
      collection: "warns",
      where: {
        id: {
          equals: warningId,
        },
        server: {
          equals: serverId,
        },
      },
    })

    return result.docs[0]
  }
}
