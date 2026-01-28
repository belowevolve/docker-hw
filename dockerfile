# Этап 1: Сборка приложения
FROM oven/bun:1 AS build

WORKDIR /app

# Копируем файлы манифеста и устанавливаем зависимости
COPY package.json bun.lock ./
RUN bun install

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение для продакшена
RUN bun run build

# Этап 2: Запуск приложения под управлением Nginx
FROM nginx:alpine

# Копируем собранные файлы из этапа сборки в директорию Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем 80-й порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
