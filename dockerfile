FROM node:20-alpine

WORKDIR /app

# зависимости
COPY package.json package-lock.json* ./
RUN npm install

# prisma (ВАЖНО скопировать отдельно, чтобы не ломать кеш)
COPY prisma ./prisma

# генерация клиента
RUN npx prisma generate

# копируем остальной проект
COPY . .

# dev режим
ENV NODE_ENV=development
ENV SESSION_SECRET="practice-project-session-secret"

EXPOSE 3000

CMD ["npm", "run", "dev"]