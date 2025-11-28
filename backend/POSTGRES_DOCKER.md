# Документация по PostgreSQL в Docker

## Описание

Этот проект использует PostgreSQL 15 (Alpine версия) в Docker контейнере для хранения данных. Конфигурация настроена через Docker Compose для удобного управления базой данных.

## Структура конфигурации

### Файл `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: postgres_db
    environment:
      POSTGRES_DB: Lessons
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend-network

volumes:
  postgres_data:

networks:
  backend-network:
    driver: bridge
```

## Параметры конфигурации

### Основные параметры

- **Image**: `postgres:15-alpine` - легковесная версия PostgreSQL 15
- **Container Name**: `postgres_db` - имя контейнера
- **Database Name**: `Lessons` - имя базы данных
- **User**: `postgres` - имя пользователя
- **Password**: `123` - пароль пользователя
- **Port**: `5432` - порт для подключения

### Volumes

- `postgres_data` - именованный том для хранения данных PostgreSQL. Данные сохраняются даже после остановки контейнера.

### Networks

- `backend-network` - изолированная сеть для связи между сервисами бэкенда.

### Healthcheck

Автоматическая проверка готовности базы данных каждые 10 секунд.

## Установка и запуск

### Предварительные требования

- Docker установлен и запущен
- Docker Compose установлен

### Запуск PostgreSQL

1. Перейдите в папку `backend`:
   ```bash
   cd backend
   ```

2. Запустите контейнер в фоновом режиме:
   ```bash
   docker-compose up -d
   ```

3. Проверьте статус контейнера:
   ```bash
   docker-compose ps
   ```

### Остановка PostgreSQL

```bash
docker-compose down
```

**Важно**: Данные сохраняются в томе `postgres_data` и не будут удалены при остановке.

### Полная остановка с удалением данных

```bash
docker-compose down -v
```

**Внимание**: Это удалит все данные из базы!

## Подключение к базе данных

### Через psql (внутри контейнера)

```bash
docker exec -it postgres_db psql -U postgres -d Lessons
```

### Через psql (локально)

Если у вас установлен PostgreSQL клиент локально:

```bash
psql -h localhost -p 5432 -U postgres -d Lessons
```

Пароль: `123`

### Через приложение (Node.js пример)

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'Lessons',
  user: 'postgres',
  password: '123',
});
```

### Через приложение (Python пример)

```python
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="Lessons",
    user="postgres",
    password="123"
)
```

## Полезные команды

### Просмотр логов

```bash
docker-compose logs postgres
```

### Просмотр логов в реальном времени

```bash
docker-compose logs -f postgres
```

### Выполнение SQL команд

```bash
docker exec -it postgres_db psql -U postgres -d Lessons -c "SELECT version();"
```

### Создание резервной копии (backup)

```bash
docker exec -t postgres_db pg_dump -U postgres Lessons > backup.sql
```

### Восстановление из резервной копии

```bash
docker exec -i postgres_db psql -U postgres -d Lessons < backup.sql
```

### Просмотр размера базы данных

```bash
docker exec -it postgres_db psql -U postgres -d Lessons -c "SELECT pg_size_pretty(pg_database_size('Lessons'));"
```

### Список всех баз данных

```bash
docker exec -it postgres_db psql -U postgres -c "\l"
```

### Список всех таблиц

```bash
docker exec -it postgres_db psql -U postgres -d Lessons -c "\dt"
```

## Изменение конфигурации

### Изменение пароля

1. Отредактируйте `docker-compose.yml`:
   ```yaml
   POSTGRES_PASSWORD: ваш_новый_пароль
   ```

2. Пересоздайте контейнер:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

**Важно**: При изменении пароля существующие данные сохранятся, но потребуется обновить настройки подключения в приложении.

### Изменение имени базы данных

1. Отредактируйте `docker-compose.yml`:
   ```yaml
   POSTGRES_DB: новое_имя_базы
   ```

2. Пересоздайте контейнер:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

**Внимание**: `-v` удалит все данные. Создайте резервную копию перед изменением!

## Устранение неполадок

### Контейнер не запускается

1. Проверьте логи:
   ```bash
   docker-compose logs postgres
   ```

2. Проверьте, не занят ли порт 5432:
   ```bash
   # Windows
   netstat -ano | findstr :5432
   
   # Linux/Mac
   lsof -i :5432
   ```

3. Если порт занят, измените порт в `docker-compose.yml`:
   ```yaml
   ports:
     - "5433:5432"  # Используйте другой порт
   ```

### Проблемы с подключением

1. Убедитесь, что контейнер запущен:
   ```bash
   docker-compose ps
   ```

2. Проверьте healthcheck:
   ```bash
   docker inspect postgres_db | grep -A 10 Health
   ```

3. Проверьте сетевые настройки:
   ```bash
   docker network inspect backend_backend-network
   ```

### Проблемы с правами доступа

Если возникают проблемы с доступом к данным:

```bash
docker exec -it postgres_db chown -R postgres:postgres /var/lib/postgresql/data
```

## Безопасность

### Рекомендации для продакшена

1. **Измените пароль по умолчанию**:
   ```yaml
   POSTGRES_PASSWORD: сильный_случайный_пароль
   ```

2. **Используйте переменные окружения**:
   Создайте файл `.env`:
   ```env
   POSTGRES_DB=Lessons
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=ваш_безопасный_пароль
   ```
   
   И обновите `docker-compose.yml`:
   ```yaml
   environment:
     POSTGRES_DB: ${POSTGRES_DB}
     POSTGRES_USER: ${POSTGRES_USER}
     POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
   ```

3. **Ограничьте доступ к порту**:
   В продакшене не открывайте порт наружу, используйте внутреннюю сеть Docker.

4. **Регулярно создавайте резервные копии**:
   Настройте автоматическое создание бэкапов.

## Дополнительные ресурсы

- [Официальная документация PostgreSQL](https://www.postgresql.org/docs/)
- [Docker Hub - PostgreSQL](https://hub.docker.com/_/postgres)
- [Docker Compose документация](https://docs.docker.com/compose/)

## Версия

- PostgreSQL: 15
- Docker Compose: 3.8
- Обновлено: 2025

