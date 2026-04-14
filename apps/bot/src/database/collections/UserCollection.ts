import type { User } from "@repo/shared/payload-types"
import type { Payload } from "payload"

export class UserCollection {
  private db: Payload

  constructor(db: Payload) {
    this.db = db
  }

  /**
   * Create a new user.
   *
   * @param data The data for the new user.
   * @returns The created user document.
   */
  public async createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    return await this.db.create({
      collection: "users",
      data,
    })
  }

  /**
   * Find a user by their ID.
   *
   * @param userId The discord ID of the user to find.
   * @returns The user document, or `undefined` if not found.
   */
  public async getUserById(userId: string): Promise<User> {
    const user = await this.db.find({
      collection: "users",
      where: {
        userId: {
          equals: userId,
        },
      },
      limit: 1,
    })

    return user.docs[0]
  }

  /**
   * Update a user by their ID.
   *
   * @param userId The discord ID of the user to update.
   * @param data The data to update.
   */
  public async updateUser(userId: string, data: Partial<User>): Promise<void> {
    await this.db.update({
      collection: "users",
      where: {
        userId: {
          equals: userId,
        },
      },
      data,
    })
  }

  /**
   * Delete a user by their ID.
   *
   * @param userId The discord ID of the user to delete.
   */
  public async deleteUser(userId: string): Promise<void> {
    await this.db.delete({
      collection: "users",
      where: {
        userId: {
          equals: userId,
        },
      },
    })
  }
}
