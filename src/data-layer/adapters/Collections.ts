import KeyvDatabase from "./Keyv"

const Collections = {
  users: KeyvDatabase.collection("users"),
  servers: KeyvDatabase.collection("servers"),
}

export default Collections
