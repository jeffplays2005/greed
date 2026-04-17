import type { Confession } from "@repo/shared/payload-types"
import type { Payload } from "payload"

export class ConfessionCollection {
  private db: Payload

  constructor(db: Payload) {
    this.db = db
  }

  /**
   * Creates a new confession.
   *
   * @param data The data for the new confession with payload fields omitted.
   * @returns The created Confession document
   */
  public async createConfession(
    data: Omit<Confession, "id" | "createdAt" | "updatedAt">,
  ): Promise<Confession> {
    return await this.db.create({
      collection: "confessions",
      data,
    })
  }

  /**
   * Retrieves a confession by its ID.
   *
   * @param confessionId The ID of the confession to retrieve.
   * @returns The Confession document if found, otherwise `undefined`.
   */
  public async getConfessionById(confessionId: string): Promise<Confession | undefined> {
    return await this.db.findByID({
      collection: "confessions",
      id: confessionId,
    })
  }
}
