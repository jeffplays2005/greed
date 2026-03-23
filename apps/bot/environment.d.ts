declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * The Discord bot token.
       */
      BOT_TOKEN: string
      /**
       * The Postgres database URL.
       */
      DB_URL: string
      /**
       * The environment in which the application is running.
       */
      NODE_ENV: "development" | "staging" | "production"
    }
  }
}
