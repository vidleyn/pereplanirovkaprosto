# Auth Node.js Service

Node.js версия сервиса аутентификации, переписанная с Java/Spring Boot.

## Установка

```bash
npm install
```

## Настройка

Скопируйте `.env` файл и настройте переменные окружения:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Lessons
DB_USER=postgres
DB_PASSWORD=123

JWT_SECRET=U3VwZXJTZWNyZXRLZXlGb3JKV1RHZW5lcmF0aW9uSW5TcHJpbmdCb290QXBwbGljYXRpb24=
JWT_EXPIRATION=86400000

PORT=8080
NODE_ENV=development

FLOORPLAN_API_URL=http://localhost:8000
```

## Запуск

### Разработка
```bash
npm run dev
```

### Продакшн
```bash
npm start
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/user` - Получить текущего пользователя (требует токен)
- `POST /api/auth/logout` - Выход (требует токен)

### Dashboard
- `GET /dashboard` - Получить данные пользователя (требует токен)

### Floor Plan
- `GET /api/floorplan/health` - Проверка здоровья сервиса
- `POST /api/floorplan/analyze` - Анализ планировки (требует токен)

## Использование

Все защищенные эндпоинты требуют заголовок:
```
Authorization: Bearer <token>
```

