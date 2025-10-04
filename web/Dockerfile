FROM node:24-slim AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

FROM node:24-slim AS runtime
WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/dist ./dist
COPY package.json pnpm-lock.yaml* ./

RUN pnpm add vite

EXPOSE 80

CMD ["pnpm", "exec", "vite", "preview", "--port", "80", "--host"]
