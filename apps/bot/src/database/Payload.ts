import configPromise from "@repo/payload/config"
import { getPayload, type Payload } from "payload"

const getRequiredEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Please set ${name} before starting the application.`,
    )
  }
  return value
}

getRequiredEnv("DATABASE_URI")
getRequiredEnv("PAYLOAD_SECRET")

const payloadConfig = await getPayload({
  config: configPromise,
})

export const payload: Payload = payloadConfig
