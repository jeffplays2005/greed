declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * The Discord bot token.
       */
      DISCORD_TOKEN: string
      /**
       * The Discord bot application ID.
       */
      DISCORD_APPLICATION_ID: string
      /**
       * The Discord bot public key.
       */
      DISCORD_PUBLIC_KEY: string

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
