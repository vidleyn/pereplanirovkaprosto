import React, { useEffect, useState } from "react";
import LegacyBootstrap from "./ui/components/LegacyBootstrap";
import Sidebar from "./ui/components/Sidebar";
import FloorplannerControls from "./ui/components/FloorplannerControls";
import MainControls from "./ui/components/MainControls";
import InterfaceControls from "./ui/components/InterfaceControls";

export default function App() {
  const [viewMode, setViewMode] = useState<"2d" | "3d" | "firstperson">("2d");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // helper to access legacy blueprint instance created by LegacyBootstrap
  const bp = () =>
    (window as any).blueprint3d ||
    ((window as any).BP3DJS && (window as any).blueprint3d);

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
    }
  }, [viewMode]);

  return (
    <div className="app-root">
      <Sidebar
        blueprint3d={bp()}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <header className="p-2 border-b border-gray-200">
        <strong>Architect3D — редактор планировок</strong>
      </header>

      <div className="h-[calc(100vh-56px)]">
        {/* --- 2D LEFT PANEL --- */}
        <div className="flex-1 min-w-[360px]">
          <div
            id="floorplanner"
            className={`h-full relative ${viewMode === "2d" ? "block" : "hidden"}`}
          >
            <FloorplannerControls blueprint3d={bp()} />

            <div className="btn-hint" id="draw-walls-hint" style={{ display: "none" }}>
              Нажмите клавишу "Esc" чтобы остановить рисование стен
            </div>

            <canvas
              id="floorplanner-canvas"
              className="w-full h-full"
            />
          </div>

          {/* hidden file input used by Load design from image */}
          <input
            type="file"
            id="imageFileInput"
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* --- 3D RIGHT PANEL --- */}
        <div className="flex-1 min-w-[480px]">
          <div
            id="viewer"
            className={`h-full relative ${
              viewMode === "3d" || viewMode === "firstperson" ? "block" : "hidden"
            }`}
          >
            <MainControls blueprint3d={bp()} />
          </div>
        </div>
      </div>

      <InterfaceControls
        blueprint3d={bp()}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Модалки «Add Items» остаются в LegacyBootstrap */}
      <LegacyBootstrap />
    </div>
  );
}

