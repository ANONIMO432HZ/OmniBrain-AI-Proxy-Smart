# Usa la imagen oficial de Bun sobre Alpine para un tamaño mínimo
FROM oven/bun:alpine AS base
WORKDIR /app

# Instalar dependencias primero para aprovechar el cache de capas
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lock* /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production


# Etapa final: Imagen de ejecución
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# Asegurar que el directorio de datos existe y tiene permisos
RUN mkdir -p /app/data && chown -R bun:bun /app/data

# Configurar entorno de producción
ENV NODE_ENV=production
USER bun
EXPOSE 3000

# Comando de inicio
ENTRYPOINT [ "bun", "run", "index.ts" ]
