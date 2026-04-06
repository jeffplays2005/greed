FROM oven/bun:1 AS runner

ENV NODE_ENV=production

WORKDIR /app

# Stage 0: Install bun runtime
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Stage 1: Install prod deps
COPY --link package.json bun.lock tsconfig.json ./
COPY --link ./apps/bot/package.json ./apps/bot/package.json
COPY --link ./packages ./packages
RUN bun install --filter bot

# Stage 2: Prepare entrypoint
COPY --link ./apps/bot ./apps/bot
CMD ["bun", "--filter", "bot", "dev"]
