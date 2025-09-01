import type { CollectionConfig } from "payload"

export const Servers: CollectionConfig = {
  slug: "servers",
  fields: [
    {
      name: "serverId",
      type: "text",
    },
  ],
}
