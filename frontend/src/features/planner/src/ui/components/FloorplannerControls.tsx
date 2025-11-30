import React from "react";

interface FloorplannerControlsProps {
  blueprint3d: any;
}

export default function FloorplannerControls({
  blueprint3d,
}: FloorplannerControlsProps) {
  const [mode, setMode] = React.useState<"move" | "draw" | "delete">("move");

  React.useEffect(() => {
    if (!blueprint3d?.floorplanner) return;

    const floorplanner = blueprint3d.floorplanner;
    const BP3DJS = (window as any).BP3DJS;

    const handleModeReset = (event: any) => {
      const newMode = event.mode;
      if (newMode === BP3DJS.floorplannerModes.MOVE) {
        setMode("move");
      } else if (newMode === BP3DJS.floorplannerModes.DRAW) {
        setMode("draw");
      } else if (newMode === BP3DJS.floorplannerModes.DELETE) {
        setMode("delete");
      }

      // Показать/скрыть подсказку для режима рисования
      const hintElement = document.getElementById("draw-walls-hint");
      if (hintElement) {
        if (newMode === BP3DJS.floorplannerModes.DRAW) {
          hintElement.style.display = "block";
        } else {
          hintElement.style.display = "none";
        }
      }
    };

    floorplanner.addEventListener(BP3DJS.EVENT_MODE_RESET, handleModeReset);

    return () => {
      floorplanner.removeEventListener(
        BP3DJS.EVENT_MODE_RESET,
        handleModeReset
      );
    };
  }, [blueprint3d]);

  const handleModeClick = (newMode: "move" | "draw" | "delete") => {
    if (!blueprint3d?.floorplanner) return;
    const BP3DJS = (window as any).BP3DJS;
    const modeMap = {
      move: BP3DJS.floorplannerModes.MOVE,
      draw: BP3DJS.floorplannerModes.DRAW,
      delete: BP3DJS.floorplannerModes.DELETE,
    };
    blueprint3d.floorplanner.setMode(modeMap[newMode]);
  };

  return (
    <div
      id="floorplanner-controls"
      className="fixed top-6 left-6 z-50"
    >
      {/* Все кнопки в одной строке */}
      <div className="flex flex-nowrap items-center gap-2">
        {/* Файловые операции */}
        <button
          title="Новая планировка"
          onClick={(e) => {
            e.preventDefault();
            // Триггерим клик на скрытом элементе для legacy кода
            const legacyBtn = document.getElementById("new2d");
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
            const legacyBtn = document.getElementById("saveFile2d");
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
          htmlFor="loadFile2d"
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
          title="Загрузить планировку из изображения"
          onClick={(e) => {
            e.preventDefault();
            // Триггерим клик на скрытом элементе для legacy кода
            const legacyBtn = document.getElementById("loadDesignFromImage");
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm font-medium">Из изображения</span>
        </button>

        {/* Разделитель */}
        <div className="w-px h-10 bg-gray-300 mx-1" />

        {/* Инструменты редактирования */}
        <button
          id="move"
          onClick={() => handleModeClick("move")}
          title="Переместить стены"
          className={`group flex items-center gap-2 px-5 py-4 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
            mode === "move"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-transform ${
              mode === "move" ? "rotate-0" : "group-hover:rotate-12"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
          <span className="text-base">Переместить</span>
        </button>

        <button
          id="draw"
          onClick={() => handleModeClick("draw")}
          title="Нарисовать новые стены"
          className={`group flex items-center gap-2 px-5 py-4 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
            mode === "draw"
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-transform ${
              mode === "draw" ? "rotate-0" : "group-hover:rotate-12"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <span className="text-base">Рисовать</span>
        </button>

        <button
          id="delete"
          onClick={() => handleModeClick("delete")}
          title="Удалить стены"
          className={`group flex items-center gap-2 px-5 py-4 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
            mode === "delete"
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/50 scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-transform ${
              mode === "delete" ? "rotate-0" : "group-hover:rotate-12"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span className="text-base">Удалить</span>
        </button>

        <button
          id="help2d"
          title="Подсказки: Shift - Привязка к осям и сетке, ESC - Остановить рисование стен, Двойной клик (Угол) - Изменить высоту, Клик (Комната) - Изменить название"
          onClick={(e) => e.preventDefault()}
          className="group flex items-center gap-2 px-4 py-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all duration-200 whitespace-nowrap"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* Скрытые элементы для legacy кода */}
      <div className="hidden">
        <a href="#" id="new2d" onClick={(e) => e.preventDefault()} />
        <a href="#" id="saveFile2d" onClick={(e) => e.preventDefault()} />
        <input type="file" className="hidden" id="loadFile2d" />
        <a
          href="#"
          id="loadDesignFromImage"
          onClick={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
}
