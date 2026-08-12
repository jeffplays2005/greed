import path from "node:path"
import { fileURLToPath } from "node:url"
import { mongooseAdapter } from "@payloadcms/db-mongodb"
import type { Config } from "@repo/shared/payload-types"
import { buildConfig } from "payload"
import sharp from "sharp"
import { Admins } from "./collections/Admins"
import { ConfessionMutes } from "./collections/ConfessionMutes"
import { Confessions } from "./collections/Confessions"
import { Servers } from "./collections/Servers"
import { Users } from "./collections/Users"
import { Warns } from "./collections/Warns"
import { BotConfig } from "./globals/BotConfig"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Admins, Users, Servers, Confessions, ConfessionMutes, Warns],
  globals: [BotConfig],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "../../shared/src/payload-types.ts"),
    declare: false,
  },
  graphQL: {
    disable: true,
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins: [],
})

declare module "payload" {
  export interface GeneratedTypes extends Config {}
}
