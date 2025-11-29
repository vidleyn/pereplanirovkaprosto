# Настройка планировщика Architect3D

Для работы планировщика необходимо скопировать файлы из проекта `architect3d` в папку `frontend/public/planner`.

## Инструкция по установке

### Вариант 1: Автоматическое копирование (Windows PowerShell)

Выполните следующую команду в корне проекта:

```powershell
Copy-Item -Path "architect3d\build\*" -Destination "frontend\public\planner\" -Recurse -Force
```

### Вариант 2: Ручное копирование

1. Скопируйте всю папку `architect3d/build/` 
2. Вставьте содержимое в `frontend/public/planner/`

### Структура после копирования

После копирования структура должна выглядеть так:

```
frontend/public/planner/
├── index.html
├── css/
│   ├── app.css
│   ├── bootstrap.min.css
│   ├── jquery-ui.css
│   └── ...
├── js/
│   ├── app.js
│   ├── bp3djs.js
│   ├── items.js
│   ├── items_gltf.js
│   ├── lib/
│   └── ...
├── models/
│   ├── gltf/
│   ├── js/
│   ├── obj/
│   └── ...
└── rooms/
    ├── textures/
    └── ...
```

## Проверка

После копирования файлов:
1. Запустите фронтенд: `cd frontend && npm run dev`
2. Перейдите на страницу `/planner`
3. Должен загрузиться планировщик Architect3D

## Примечания

- Планировщик работает в iframe для изоляции от React приложения
- Все файлы должны быть доступны по пути `/planner/...`
- Если планировщик не загружается, проверьте консоль браузера на наличие ошибок загрузки файлов


