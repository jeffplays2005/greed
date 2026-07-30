import type { CollectionConfig } from "payload"

export const Servers: CollectionConfig = {
  slug: "servers",
  fields: [
    {
      name: "serverId",
      type: "text",
    },
    {
      name: "confessionSettings",
      type: "group",
      interfaceName: "ConfessionSettings",
      required: false,
      fields: [
        {
          name: "cooldownSeconds",
          type: "number",
          defaultValue: 300,
        },
        {
          name: "channel",
          type: "text",
        },
      ],
    },
    {
      name: "phishingImageSettings",
      type: "group",
      interfaceName: "PhishingImageSettings",
      required: false,
      fields: [
        {
          name: "bannedImages",
          type: "array",
          fields: [
            {
              name: "description",
              type: "text",
              required: true,
            },
            {
              name: "imageHash",
              type: "text",
              required: true,
            },
            {
              name: "imageUrl",
              type: "text",
              required: true,
            },
            {
              name: "bannedBy",
              type: "text",
              required: true,
            },
          ],
        },
        {
          name: "defaultAction",
          type: "select",
          interfaceName: "PhishingImageActions",
          options: ["KICK", "BAN", "LOG", "DELETE"],
          defaultValue: "BAN",
        },
      ],
    },
    {
      name: "bumpInfo",
      type: "group",
      interfaceName: "BumpInfo",
      fields: [
        {
          name: "bumpedAt",
          type: "date",
        },
        {
          name: "nextBump",
          type: "date",
        },
      ],
    },
  ],
}
