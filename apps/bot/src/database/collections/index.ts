import { payload } from "../adapters/Payload"
import { ConfessionCollection } from "./ConfessionCollection"
import { ServerCollection } from "./ServerCollection"
import { UserCollection } from "./UserCollection"

export const db = {
  users: new UserCollection(payload),
  confessions: new ConfessionCollection(payload),
  servers: new ServerCollection(payload),
}
