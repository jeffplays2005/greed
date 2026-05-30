import type { GlobalConfig } from "payload"

export const BotConfig: GlobalConfig = {
  slug: "bot-config",
  fields: [
    {
      name: "disabledCommands",
      type: "text",
      hasMany: true,
      defaultValue: [],
    },
  ],
}
