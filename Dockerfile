FROM node:22.18.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production

FROM base AS runner
WORKDIR /app
RUN corepack enable

# Stage 0: Install bun runtime
RUN pnpm i -g bun

# Stage 1: Install prod deps
COPY --link package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY --link ./apps/bot/package.json ./apps/bot/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter bot --prod

# Stage 2: Prepare entrypoint
COPY --link ./apps/bot ./apps/bot
CMD ["pnpm", "-C", "apps/bot", "dev"]
