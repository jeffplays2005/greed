import type { ConfessionMute } from "@repo/shared/payload-types"
import type { Payload } from "payload"

export class ConfessionMutesCollection {
  private db: Payload

  constructor(db: Payload) {
    this.db = db
  }

  /**
   * Creates a new mute record.
   *
   * @param data The mute data to create.
   * @returns The created ConfessionMute document.
   */
  public async muteConfession(
    data: Omit<ConfessionMute, "id" | "createdAt" | "updatedAt">,
  ): Promise<ConfessionMute> {
    return await this.db.create({
      collection: "confession-mutes",
      data,
    })
  }

  /**
   * Retrieves all mutes for a specific server.
   *
   * @param serverId The Discord ID of the server.
   * @returns An array of ConfessionMute documents.
   */
  public async getServerMutedConfessions(serverId: string): Promise<ConfessionMute[]> {
    return (
      await this.db.find({
        collection: "confession-mutes",
        where: {
          serverId: {
            equals: serverId,
          },
        },
      })
    ).docs
  }

  /**
   * Retrieves a mute by confession ID.
   *
   * @param confessionId The ID of the confession.
   * @returns The ConfessionMute document if found, otherwise undefined.
   */
  public async getMuteByConfessionId(confessionId: string): Promise<ConfessionMute | undefined> {
    return (
      await this.db.find({
        collection: "confession-mutes",
        where: {
          confession: {
            equals: confessionId,
          },
        },
        limit: 1,
      })
    ).docs[0]
  }

  /**
   * Deletes a mute by confession ID.
   *
   * @param confessionId The ID of the confession.
   * @returns True if the mute was deleted, false otherwise.
   */
  public async unmuteConfession(confessionId: string): Promise<boolean> {
    const mute = await this.getMuteByConfessionId(confessionId)
    if (!mute) return false

    await this.db.delete({
      collection: "confession-mutes",
      id: mute.id,
    })
    return true
  }

  /**
   * Checks if a user is muted for a specific server.
   *
   * @param userId The Discord ID of the user.
   * @param serverId The Discord ID of the server.
   * @returns True if the user is muted in that server, false otherwise.
   */
  public async isUserMutedInServer(userId: string, serverId: string): Promise<boolean> {
    return (
      (
        await this.db.find({
          collection: "confession-mutes",
          where: {
            userId: {
              equals: userId,
            },
            serverId: {
              equals: serverId,
            },
          },
          limit: 1,
        })
      ).docs.length > 0
    )
  }
}
