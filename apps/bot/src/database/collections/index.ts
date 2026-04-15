import { payload } from "../adapters/Payload"
import { UserCollection } from "./UserCollection"

export const db = {
  users: new UserCollection(payload),
}
