# Сборка и запуск проекта в режиме разработки

## Требования

- [Node.js](https://nodejs.org/en/) >= v18.15.0
- [npm](https://www.npmjs.com/) >= v9.5.0
- [Docker & Docker compose](https://www.docker.com/) >= v20.10.23
- [NX](https://nx.dev/) >= v15.8.6 (необязательно)

## Установка зависимостей

Перейти в директорию с проектом. Все дальнейшие команды выполнять в этой директории.
```bash
cd ./project
```

Установить npm зависимости

```bash
npm install
```

Установить глобально NX (необязательно). 

```bash
npm install -g nx
```

В случае если NX не установлен, все команды можно выполнять через `npx nx`

## Подготовка переменных окружения

Скопировать файлы `.env.example` в `.env`

```bash
cp ./apps/users/.env-example ./apps/users/.env
cp ./apps/posts/.env-example ./apps/posts/.env
cp ./apps/notifications/.env-example ./apps/notifications/.env
cp ./apps/files/.env-example ./apps/files/.env
cp ./apps/bff/.env-example ./apps/bff/.env
```

## Запуск docker контейнеров с необходимыми сервисами

```bash
docker-compose -f ./apps/users/docker-compose.dev.yml up -d
docker-compose -f ./apps/posts/docker-compose.dev.yml up -d
docker-compose -f ./apps/notifications/docker-compose.dev.yml up -d
docker-compose -f ./apps/files/docker-compose.dev.yml up -d
```

## Подготовка баз данных

Генерация клиента для prisma

```bash
nx run posts:db:generate
```

Применение миграций
  
```bash
nx run posts:db:migrate
```

Применение сидов (необязательно)

```bash
nx run posts:db:seed
```

## Запуск приложения

```bash
nx run users:serve
nx run posts:serve
nx run notifications:serve
nx run files:serve
nx run bff:serve
```

## Проверка работоспособности

Информация о запущенных сервисах будет выведена в консоль.
Все взаимодействия с сервисами происходят через BFF.
Все http запросы для тестов определены в папке `./apps/bff/src/app/http`

## Запуск через makefile

```bash
make prepare
```

```bash
make run_users
```

```bash
make run_notifications
```

```bash
make run_files
```

```bash
make run_posts
```

```bash
make run_bff
```
