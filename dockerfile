# --- Слой 1: Сборка (Build Stage) ---
# Используем официальный образ Bun. Мы называем этот этап "build", чтобы ссылаться на него позже.
FROM oven/bun:1-alpine AS build

# Установка рабочей директории. Все последующие команды будут выполняться здесь.
WORKDIR /app

# Сначала копируем только файлы манифестов. 
# Это КРИТИЧЕСКИ ВАЖНО для кэширования слоев Docker.
# Если package.json и bun.lock не менялись, Docker пропустит 'bun install' при следующей сборке.
COPY package.json bun.lock ./

# Устанавливаем зависимости. Используем --frozen-lockfile для гарантии идентичности версий.
# Этот слой кэшируется отдельно от кода приложения.
RUN bun install --frozen-lockfile

# Копируем остальные файлы исходного кода.
# Мы делаем это ПОСЛЕ установки зависимостей, чтобы изменения в коде не инвалидировали кэш 'bun install'.
COPY . .

# Собираем production-ready бандл (обычно в папку /dist).
RUN bun run build


# --- Слой 2: Продакшн (Production Stage) ---
# Используем легковесный Nginx на базе Alpine Linux.
FROM nginx:stable-alpine

# Копируем ТОЛЬКО результат сборки из предыдущего этапа (build).
# Это позволяет итоговому образу весить в разы меньше, так как в нем нет Bun, исходников и node_modules.
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем наш кастомный конфиг Nginx.
COPY nginx.conf /etc/nginx/nginx.conf

# Информируем Docker, что контейнер слушает 80 порт.
EXPOSE 80

# Запускаем Nginx в фоновом режиме (daemon off), чтобы Docker мог отслеживать процесс.
CMD ["nginx", "-g", "daemon off;"]
