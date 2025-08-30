import KeyvPostgres from "@keyv/postgres"
import KeyvSqlite from "@keyv/sqlite"
import Keyv from "keyv"
import "dotenv/config"

const KeyvDatabase = {
  /**
   * Creates a new collection with target table name.
   *
   * @param table the table name
   * @returns returns the collection adapter
   */
  collection: (table: string) => {
    let adapter: KeyvSqlite | KeyvPostgres
    if (process.env.NODE_ENV === "staging") {
      adapter = new KeyvSqlite({ uri: process.env.DB_URL, table })
    } else {
      adapter = new KeyvPostgres({ uri: process.env.DB_URL, table })
    }

    adapter.on("error", (err: Error) => console.error("KeyvSQL Error:", err))
    const db = new Keyv({ store: adapter })
    db.on("error", (err: Error) => console.error("Keyv Error:", err))
    return db
  },
}

export default KeyvDatabase
