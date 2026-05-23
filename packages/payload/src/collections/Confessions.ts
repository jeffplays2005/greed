import type { CollectionConfig } from "payload"

export const Confessions: CollectionConfig = {
  slug: "confessions",
  fields: [
    {
      type: "text",
      name: "userId",
      admin: {
        description:
          "The user ID stored for a particular confession. Note that this is not a relation to the Users collection as a user is not expected to have a db record via that.",
      },
    },
    {
      type: "text",
      name: "serverId",
      admin: {
        description: "The server ID stored for a particular confession.",
      },
    },
  ],
}
