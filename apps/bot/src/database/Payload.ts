import configPromise from "@repo/payload/config"
import { getPayload, type Payload } from "payload"

const payloadConfig = await getPayload({
  config: configPromise,
})

export const payload: Payload = payloadConfig
