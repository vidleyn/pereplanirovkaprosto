import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

function DocumentationContent() {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch("/documentation.md");
        
        if (!response.ok) {
          throw new Error("Не удалось загрузить документацию");
        }
        
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
        // Заглушка на случай если файл не найден
        setContent(`# Справочник РемонтПроводник

Добро пожаловать в справочник РемонтПроводник!

## О проекте

РемонтПроводник — это комплексная платформа для сопровождения ремонта на всех этапах.

## Основные возможности

### 1. Планировка жилья
- Создание планов помещений
- 3D визуализация
- Анализ планировок БТИ

### 2. Согласование и бюрократия
- Помощь с документами
- Консультации по согласованию перепланировок
- Подготовка необходимых документов

### 3. Выбор мебели
- Каталог мебели от производителей
- Планирование расстановки
- 3D визуализация интерьера

### 4. Поиск мастеров
- База проверенных мастеров
- Отзывы и рейтинги
- Прямая связь с исполнителями

### 5. Покупка у производителей
- Прямые поставки от производителей
- Выгодные цены
- Гарантия качества

## Как начать

1. Зарегистрируйтесь на платформе
2. Создайте свой проект
3. Начните планирование

## Поддержка

Если у вас возникли вопросы, свяжитесь с нами через форму обратной связи.

---

*Этот справочник будет обновляться по мере развития платформы.*`);
      } finally {
        setLoading(false);
      }
    };

    loadDocumentation();
  }, []);

  // Простой парсер Markdown для базового форматирования
  const formatMarkdown = (text: string) => {
    return text
      .split("\n")
      .map((line, index) => {
        // Заголовки
        if (line.startsWith("# ")) {
          return (
            <h1 key={index} className="text-4xl font-bold mb-6 mt-8 first:mt-0">
              {line.substring(2)}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={index} className="text-3xl font-bold mb-4 mt-6">
              {line.substring(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="text-2xl font-semibold mb-3 mt-5">
              {line.substring(4)}
            </h3>
          );
        }
        // Списки
        if (line.startsWith("- ")) {
          return (
            <li key={index} className="ml-6 mb-2">
              {line.substring(2)}
            </li>
          );
        }
        // Нумерованные списки
        if (/^\d+\.\s/.test(line)) {
          return (
            <li key={index} className="ml-6 mb-2 list-decimal">
              {line.replace(/^\d+\.\s/, "")}
            </li>
          );
        }
        // Курсив
        if (line.startsWith("*") && line.endsWith("*") && line.length > 2) {
          return (
            <p key={index} className="text-gray-400 italic mb-4">
              {line.substring(1, line.length - 1)}
            </p>
          );
        }
        // Горизонтальная линия
        if (line.startsWith("---")) {
          return <hr key={index} className="my-8 border-gray-700" />;
        }
        // Обычный текст
        if (line.trim()) {
          return (
            <p key={index} className="mb-4 text-gray-300 leading-relaxed">
              {line}
            </p>
          );
        }
        // Пустые строки
        return <br key={index} />;
      });
  };

  if (loading) {
    return (
      <section className="relative bg-[#0B0F19] text-white overflow-hidden min-h-screen">
        {/* Top green blurred shapes */}
        <div
          aria-hidden="true"
          className="absolute inset-0 transform-gpu overflow-hidden blur-3xl pointer-events-none"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="absolute left-1/2 top-0 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/4 rotate-[30deg] bg-gradient-to-tr from-[#86efac] to-[#4ade80] opacity-30"
          ></div>
        </div>

        <div className="container mx-auto px-6 py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            <p className="mt-4 text-gray-300">Загрузка документации...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#0B0F19] text-white overflow-hidden min-h-screen">
      {/* Top green blurred shapes */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transform-gpu overflow-hidden blur-3xl pointer-events-none"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="absolute left-1/2 top-0 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/4 rotate-[30deg] bg-gradient-to-tr from-[#86efac] to-[#4ade80] opacity-30"
        ></div>
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="prose prose-invert max-w-none">
              {formatMarkdown(content)}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom green blurred shapes */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transform-gpu overflow-hidden blur-3xl pointer-events-none"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="absolute left-1/2 bottom-0 w-[300%] h-[300%] -translate-x-1/2 translate-y-1/4 rotate-[-30deg] bg-gradient-to-tr from-[#86efac] to-[#4ade80] opacity-30"
        ></div>
      </div>
    </section>
  );
}

export default function Documentation() {
  return (
    <ProtectedRoute>
      <DocumentationContent />
    </ProtectedRoute>
  );
}

