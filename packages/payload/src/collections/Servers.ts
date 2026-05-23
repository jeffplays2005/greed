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
  ],
}
