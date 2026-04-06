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
      DATABASE_URI: string
      /**
       * The secret used to sign secrets in Payload.
       */
      PAYLOAD_SECRET: string
      /**
       * The environment in which the application is running.
       */
      NODE_ENV: "development" | "staging" | "production"
    }
  }
}
