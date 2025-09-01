import type { CollectionConfig } from "payload"

export const Warns: CollectionConfig = {
  slug: "warns",
  fields: [
    {
      name: "reason",
      type: "text",
    },
    {
      name: "by",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "to",
      type: "relationship",
      relationTo: "users",
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
    },
  ],
}
