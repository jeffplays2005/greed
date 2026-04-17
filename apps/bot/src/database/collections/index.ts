import { payload } from "../adapters/Payload"
import { ConfessionCollection } from "./ConfessionCollection"
import { UserCollection } from "./UserCollection"

export const db = {
  users: new UserCollection(payload),
  confessions: new ConfessionCollection(payload),
}
