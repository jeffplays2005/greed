import type { CollectionConfig } from "payload"

export const Users: CollectionConfig = {
  slug: "users",
  fields: [
    {
      name: "userId",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "balance",
      type: "number",
      admin: {
        description: "Set as null for users that haven't joined a team yet",
      },
    },
    {
      name: "pp",
      type: "text",
      admin: {
        description: "Example format: name;8=====D",
      },
    },
  ],
}
