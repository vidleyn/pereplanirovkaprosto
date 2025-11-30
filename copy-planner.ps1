# Скрипт для копирования файлов architect3d в frontend/public/planner

Write-Host "Копирование файлов architect3d..." -ForegroundColor Green

$sourcePath = "architect3d\build"
$destinationPath = "frontend\public\planner"

# Проверяем существование исходной папки
if (-not (Test-Path $sourcePath)) {
    Write-Host "Ошибка: Папка $sourcePath не найдена!" -ForegroundColor Red
    exit 1
}

# Создаем целевую папку если её нет
if (-not (Test-Path $destinationPath)) {
    New-Item -ItemType Directory -Path $destinationPath -Force | Out-Null
    Write-Host "Создана папка: $destinationPath" -ForegroundColor Yellow
}

# Копируем файлы
try {
    Copy-Item -Path "$sourcePath\*" -Destination $destinationPath -Recurse -Force
    Write-Host "Файлы успешно скопированы!" -ForegroundColor Green
    Write-Host "Планировщик готов к использованию." -ForegroundColor Green
} catch {
    Write-Host "Ошибка при копировании: $_" -ForegroundColor Red
    exit 1
}


