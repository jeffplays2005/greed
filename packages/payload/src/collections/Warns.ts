import type { CollectionConfig } from "payload"

export const Warns: CollectionConfig = {
  slug: "warns",
  fields: [
    {
      name: "reason",
      type: "text",
      required: true,
    },
    {
      name: "by",
      type: "text",
      admin: {
        description: "The discord user ID",
      },
      required: true,
    },
    {
      name: "to",
      type: "text",
      admin: {
        description: "The discord user ID",
      },
      required: true,
    },
    {
      name: "server",
      type: "relationship",
      relationTo: "servers",
      required: true,
    },
    {
      name: "final",
      type: "checkbox",
      defaultValue: false,
    },
  ],
}
