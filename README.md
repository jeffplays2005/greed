# Greed

A multi-purpose Discord bot built with Discord.js and TypeScript. Features an economy system, moderation tools, utilities, and other features.

## Features

- **Economy System**: User balances, income commands
- **Moderation**: Server mod commands, settings and configuration management
- **Utility Commands**: Helpful utilities like ping and information lookup
- **Interactive Buttons**: Settings panels and configuration interfaces using modern buttons

## Architecture

This is a monorepo project using Turbo workspaces with the following structure:

- **apps/bot**: Main Discord bot application
- **apps/discord-hono**: Discord interactions API server (not maintained)
- **packages/shared**: Shared utilities and types
- **packages/payload**: Payload CMS configuration for data management

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Discord Library**: discord.js 14
- **Database**: [MongoDB](https://www.mongodb.com) with [Payload CMS](https://payloadcms.com)
- **Caching**: In-memory using [Discord Collections](https://discord.js.org/docs/packages/collection/main/Collection:Class)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Build Tool**: [Turbo](https://turbo.build)
- **Code Quality**: [Biome](https://biomejs.dev) (linting and formatting)

## Getting Started

### Prerequisites

- Bun 1.3.11 or higher
- MongoDB instance
- Discord bot token

### Installation

Install dependencies using Bun:

```bash
bun install
```

### Environment Variables

Create a `.env` file in the main app directory `/apps/bot/.env`

```
cp .env.example .env
```

### Development

Start all applications in development mode:

```bash
bun dev
```

Or start individual workspaces:

```bash
bun --filter bot dev
```

### Building

Generate types and import maps:

```bash
bun generate:types
bun generate:importmap
```

### Code Quality

Run linting and formatting checks:

```bash
bun lint          # Check all files
bun lint:fix      # Auto-fix issues
bun format        # Check formatting
bun format:fix    # Auto-fix formatting
```

## Deployment

The bot is deployed via Github Actions based on a manual trigger.

## Contributing

Please follow the conventional commit message format with kebab-case scopes:

```
type(scope): description
```

Example: `feat(economy): add balance command`

## License

Copyright Apache 2.0 License © 2026 jji05

See [LICENSE](LICENSE) for full license text.
