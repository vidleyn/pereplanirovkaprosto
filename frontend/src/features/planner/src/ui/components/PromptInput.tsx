import React, { useState } from "react";

export default function PromptInput() {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      // TODO: реализовать отправку промпта
      console.log("Prompt submitted:", prompt);
      setPrompt("");
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-lg flex flex-col gap-2 ">
      {/* Уведомление-предупреждение */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-md !p-4 flex items-start gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-sm text-yellow-800">
          Внимание, при перемещении стен необходимо внести изменения в паспорт
          объекта,{" "}
          <a
            href="https://kubbti.ru/"
            onClick={(e) => {
              e.preventDefault();
            }}
            className="text-yellow-900 underline hover:text-yellow-700 font-medium transition-colors"
          >
            обратитесь в Краевое БТИ
          </a>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 border border-gray-200/50"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Опишите ваш идеальный ремонт..."
          className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200 w-md"
        />
        <button
          type="submit"
          disabled={!prompt.trim()}
          className="group flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 shadow-md"
          title="Отправить"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
