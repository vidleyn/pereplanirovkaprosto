import React, { useEffect, useState } from "react";
import LegacyBootstrap from "./ui/components/LegacyBootstrap";
import ModalHandler from "./ui/components/ModalHandler";
import Sidebar from "./ui/components/Sidebar";
import FloorplannerControls from "./ui/components/FloorplannerControls";
import MainControls from "./ui/components/MainControls";
import InterfaceControls from "./ui/components/InterfaceControls";
import PromptInput from "./ui/components/PromptInput";

export default function App() {
  const [viewMode, setViewMode] = useState<"2d" | "3d" | "firstperson">("2d");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [blueprintReady, setBlueprintReady] = useState(false);

  // helper to access legacy blueprint instance created by LegacyBootstrap
  const bp = () =>
    (window as any).blueprint3d ||
    ((window as any).BP3DJS && (window as any).blueprint3d);

  // Проверка готовности BlueprintJS
  useEffect(() => {
    const checkBlueprint = setInterval(() => {
      const inst = bp();
      if (inst && inst.three && !blueprintReady) {
        setBlueprintReady(true);
        clearInterval(checkBlueprint);
      }
    }, 100);

    return () => clearInterval(checkBlueprint);
  }, [blueprintReady]);

  useEffect(() => {
    const inst = bp();
    if (!inst) return;

    try {
      if (viewMode === "2d") {
        inst.three.pauseTheRendering(true);
        inst.three.getController().setSelectedObject(null);
      } else if (viewMode === "3d") {
        inst.model.floorplan.update();
        inst.three.pauseTheRendering(false);
        inst.three.switchFPSMode(false);
      } else if (viewMode === "firstperson") {
        inst.model.floorplan.update();
        inst.three.pauseTheRendering(false);
        inst.three.switchFPSMode(true);
      }
    } catch (err) {
      // blueprint instance may not be ready yet; ignore
      console.warn("BlueprintJS not ready:", err);
    }
  }, [viewMode, blueprintReady]);

  return (
    <div className="app-root h-full w-full flex flex-col">
      <div className="flex-1 flex relative overflow-hidden">
        <div className="flex-1 relative overflow-hidden">
          {/* --- 2D FLOORPLANNER --- */}
          <div
            id="floorplanner"
            className={`absolute inset-0 ${
              viewMode === "2d" ? "block z-10" : "hidden"
            }`}
          >
            <FloorplannerControls blueprint3d={bp()} />

            <div
              className="btn-hint"
              id="draw-walls-hint"
              style={{ display: "none" }}
            >
              Нажмите клавишу "Esc" чтобы остановить рисование стен
            </div>

            <canvas id="floorplanner-canvas" className="w-full h-full" />
          </div>

          {/* --- 3D VIEWER --- */}
          {/* Элемент всегда присутствует в DOM для инициализации BlueprintJS */}
          {/* Во время инициализации элемент должен быть видимым для WebGL */}
          <div
            id="viewer"
            className="absolute inset-0"
            style={{
              visibility:
                !blueprintReady ||
                viewMode === "3d" ||
                viewMode === "firstperson"
                  ? "visible"
                  : "hidden",
              zIndex:
                viewMode === "3d" || viewMode === "firstperson"
                  ? 10
                  : blueprintReady
                  ? -1
                  : 0,
              pointerEvents:
                viewMode === "3d" || viewMode === "firstperson"
                  ? "auto"
                  : "none",
              opacity: viewMode === "3d" || viewMode === "firstperson" ? 1 : 0,
            }}
          >
            <MainControls blueprint3d={bp()} />
          </div>

          {/* hidden file input used by Load design from image */}
          <input
            type="file"
            id="imageFileInput"
            className="hidden"
            accept="image/*"
          />

          {/* Кнопка открытия sidebar */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-50 px-3 py-3 bg-white/95 backdrop-blur-md text-gray-700 border border-gray-200 rounded-l-xl shadow-lg hover:bg-white hover:scale-105 transition-all duration-200"
              title="Открыть настройки"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}
        </div>

        <Sidebar
          blueprint3d={bp()}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      <InterfaceControls
        blueprint3d={bp()}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <PromptInput />

      {/* Модалки «Add Items» обрабатываются через ModalHandler */}
      <ModalHandler />
      <LegacyBootstrap />
    </div>
  );
}
