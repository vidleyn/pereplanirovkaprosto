import React from "react";

interface MainControlsProps {
  blueprint3d: any;
}

export default function MainControls({ blueprint3d }: MainControlsProps) {
  return (
    <div id="main-controls" className="fixed top-6 left-6 z-50">
      {/* Все кнопки в одной строке */}
      <div className="flex flex-nowrap items-center gap-2">
        {/* Логотип */}
        <a
          href="/"
          className="flex items-center px-4 py-3 rounded-xl bg-white/95 backdrop-blur-md text-gray-800 font-semibold text-xl hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg border border-gray-200/50 whitespace-nowrap"
        >
          РемонтПроводник
        </a>

        <button
          title="Новая планировка"
          onClick={(e) => {
            e.preventDefault();
            // Триггерим клик на скрытом элементе для legacy кода
            const legacyBtn = document.getElementById("new");
            if (legacyBtn) legacyBtn.click();
          }}
          className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all duration-200 whitespace-nowrap"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 group-hover:rotate-90 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-sm font-medium">Новая</span>
        </button>

        <button
          title="Сохранить планировку"
          onClick={(e) => {
            e.preventDefault();
            // Триггерим клик на скрытом элементе для legacy кода
            const legacyBtn = document.getElementById("saveFile");
            if (legacyBtn) legacyBtn.click();
          }}
          className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all duration-200 whitespace-nowrap"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          <span className="text-sm font-medium">Сохранить</span>
        </button>

        <label
          htmlFor="loadFile"
          className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all duration-200 cursor-pointer whitespace-nowrap"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm font-medium">Загрузить</span>
        </label>

        <button
          title="Сохранить сцену как mesh"
          onClick={(e) => {
            e.preventDefault();
            // Триггерим клик на скрытом элементе для legacy кода
            const legacyBtn = document.getElementById("saveMesh");
            if (legacyBtn) legacyBtn.click();
          }}
          className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all duration-200 whitespace-nowrap"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <span className="text-sm font-medium">Mesh</span>
        </button>

        <button
          title="Сохранить сцену как GLTF"
          onClick={(e) => {
            e.preventDefault();
            // Триггерим клик на скрытом элементе для legacy кода
            const legacyBtn = document.getElementById("saveGLTF");
            if (legacyBtn) legacyBtn.click();
          }}
          className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all duration-200 whitespace-nowrap"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          <span className="text-sm font-medium">GLTF</span>
        </button>
      </div>

      {/* Скрытые элементы для legacy кода */}
      <div className="hidden">
        <a href="#" id="new" onClick={(e) => e.preventDefault()} />
        <a href="#" id="saveFile" onClick={(e) => e.preventDefault()} />
        <input type="file" className="hidden" id="loadFile" />
        <a href="#" id="saveMesh" onClick={(e) => e.preventDefault()} />
        <a href="#" id="saveGLTF" onClick={(e) => e.preventDefault()} />
      </div>
    </div>
  );
}
