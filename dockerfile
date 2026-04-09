FROM node:20-alpine

WORKDIR /app

# зависимости
COPY package.json package-lock.json* ./
RUN npm install

# prisma (ВАЖНО скопировать отдельно, чтобы не ломать кеш)




# копируем остальной проект
COPY . .

# dev режим
ENV NODE_ENV=development
ENV SESSION_SECRET="practice-project-session-secret"
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/app_db"

# генерация клиента
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]