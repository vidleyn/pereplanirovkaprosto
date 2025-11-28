# Floorplan Analyzer — Full-Stack Project

Проект состоит из двух основных частей: backend (Spring Boot + Python service) и frontend (React + Vite).
Backend обеспечивает аутентификацию, работу с пользователями и отправку изображений во внутренний сервис анализа планировок.
Frontend предоставляет интерфейс для загрузки изображений и отображения результата анализа.

## Стили коммитов
Коммиты ведем на английском языке в формате "Инфинитив + Что было сделано"

По примеру
add changes to auth
refactor contact page
change README.md 
...и так далее

## Запуск проекта
### 1. Запуск backend/auth (Spring Boot)
```
cd backend/auth
mvn spring-boot:run
```

Приложение стартует на:
http://localhost:8080

### 2. Запуск backend/floorplan_analyzer (Python)
```
cd backend/floorplan_analyzer
python floorplan_analyzer.py
```

Обычно сервис слушает порт: http://localhost:5000

### 3. Запуск frontend
```
cd frontend
npm install
npm run dev
```

Frontend доступен по адресу:
http://localhost:5173
