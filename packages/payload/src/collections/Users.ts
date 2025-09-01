import type { CollectionConfig } from "payload"

export const Users: CollectionConfig = {
  slug: "users",
  fields: [
    {
      name: "balance",
      type: "number",
      defaultValue: 100,
      required: true,
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
