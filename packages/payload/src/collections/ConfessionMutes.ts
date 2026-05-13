import type { CollectionConfig } from "payload"

export const ConfessionMutes: CollectionConfig = {
  slug: "confession-mutes",
  fields: [
    {
      name: "confession",
      type: "relationship",
      relationTo: "confessions",
      required: true,
      admin: {
        description: "The reference to the confession that was muted.",
      },
    },
    {
      type: "text",
      name: "userId",
      required: true,
      admin: {
        description: "The Discord ID of the user who posted the confession.",
      },
    },
    {
      type: "text",
      name: "serverId",
      required: true,
      admin: {
        description: "The Discord ID of the server.",
      },
    },
    {
      type: "text",
      name: "mutedBy",
      required: true,
      admin: {
        description: "The Discord ID of the user who muted the confession.",
      },
    },
    {
      type: "text",
      name: "reason",
      required: true,
      admin: {
        description: "The reason for muting the confession.",
      },
    },
  ],
}
