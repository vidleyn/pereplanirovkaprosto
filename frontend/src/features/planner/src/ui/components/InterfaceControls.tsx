import React from "react";

interface InterfaceControlsProps {
  blueprint3d: any;
  viewMode: "2d" | "3d" | "firstperson";
  onViewModeChange: (mode: "2d" | "3d" | "firstperson") => void;
}

export default function InterfaceControls({
  blueprint3d,
  viewMode,
  onViewModeChange,
}: InterfaceControlsProps) {
  const bp = () =>
    blueprint3d ||
    (window as any).blueprint3d ||
    ((window as any).BP3DJS && (window as any).blueprint3d);

  const handleSwitchCameraMode = () => {
    const inst = bp();
    if (!inst) return;
    const el = document.getElementById("showSwitchCameraMode");
    if (!el) return;
    el.classList.toggle("active");
    try {
      inst.three.switchOrthographicMode(el.classList.contains("active"));
    } catch (e) {
      // ignore
    }
  };

  const handleSwitchWireframeMode = () => {
    const inst = bp();
    if (!inst) return;
    const el = document.getElementById("showSwitchWireframeMode");
    if (!el) return;
    el.classList.toggle("wireframe-active");
    try {
      inst.three.switchWireframe(el.classList.contains("wireframe-active"));
    } catch (e) {
      // ignore
    }
  };

  const handleShowAddItems = () => {
    // Открываем модалку через глобальную функцию или напрямую
    const modal = document.getElementById("add-items-modal");
    if (modal) {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    } else {
      // Fallback для legacy кода
      const legacy = document.querySelector(
        "#interfaces #showAddItems"
      ) as HTMLElement | null;
      if (legacy) legacy.click();
    }
  };

  return (
    <div
      id="interface-controls"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {/* Основные кнопки режимов просмотра */}

      {/* Инструменты - всегда видны, больше размер */}
      {viewMode === "3d" && (
        <div className="flex flex-col gap-2 pt-1">
          <button
            id="showSwitchCameraMode"
            onClick={handleSwitchCameraMode}
            className="group flex items-center justify-center gap-3 rounded-2xl px-5 py-4 font-medium bg-white/90 backdrop-blur-md text-gray-700 shadow-lg hover:bg-white hover:scale-105 transition-all duration-300"
            title="Переключить камеру (ортогональная/перспектива)"
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
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="whitespace-nowrap text-base">Камера</span>
          </button>

          <button
            id="showSwitchWireframeMode"
            onClick={handleSwitchWireframeMode}
            className="group flex items-center justify-center gap-3 rounded-2xl px-5 py-4 font-medium bg-white/90 backdrop-blur-md text-gray-700 shadow-lg hover:bg-white hover:scale-105 transition-all duration-300"
            title="Переключить каркасный режим"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="whitespace-nowrap text-base">Каркас</span>
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onViewModeChange("2d")}
          className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition-all duration-300 ${
            viewMode === "2d"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105"
              : "bg-white/90 backdrop-blur-md text-gray-700 shadow-lg hover:bg-white hover:scale-105"
          }`}
          title="Редактировать 2D планировку"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${
              viewMode === "2d" ? "rotate-0" : "group-hover:rotate-12"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <span className="whitespace-nowrap">2D План</span>
        </button>

        <button
          onClick={() => onViewModeChange("3d")}
          className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition-all duration-300 ${
            viewMode === "3d"
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105"
              : "bg-white/90 backdrop-blur-md text-gray-700 shadow-lg hover:bg-white hover:scale-105"
          }`}
          title="Редактировать 3D планировку"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${
              viewMode === "3d" ? "rotate-0" : "group-hover:rotate-12"
            }`}
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
          <span className="whitespace-nowrap">3D Вид</span>
        </button>
      </div>

      {/* Скрытые элементы для legacy кода */}
      <button
        id="showSwitchCameraMode"
        className="hidden"
        onClick={handleSwitchCameraMode}
      />
      <button
        id="showSwitchWireframeMode"
        className="hidden"
        onClick={handleSwitchWireframeMode}
      />
      <button
        id="showAddItems"
        className="hidden"
        onClick={handleShowAddItems}
      />
    </div>
  );
}
