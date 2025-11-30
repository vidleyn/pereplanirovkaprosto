# РемонтПроводник

Проект включает в себя веб-страницы с планировщиком комнат с функцией открытия плана квартиры в редакторе прямо по изображению техпаспорта или другого чертежа. Также в него входят AI-помощником, справочной информацией, с авторизацией. Также к AI-помощнику можно обратиться через Telegram-бота.

## Как запускать проект

### 1. Запустить Docker образ

```
cd backend
docker compose up -d
```

### 2. Запустить auth-node/server.js

```
cd backend/auth-node
npm install
npm start
```

### 3. Запустить ai бота

в папке backend/ai-bot создать .env файл с текстом

```
YANDEX_API_KEY=AQVN0cshR5wYbeMl0G42wSEuPv4gHq-LKl7tqMDh
YANDEX_FOLDER_ID=b1g4ma7hplmesk44kesv
```

Запустить

```
cd backend/ai-bot
python main.py
```

### 4. Запустить frontend

```
cd frontend
npm install
npm run dev
```

Перейти на адрес http://localhost:5173
