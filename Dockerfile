FROM node:20-alpine
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Aplica o schema (db push no esqueleto) e sobe o backend
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/main.js"]
