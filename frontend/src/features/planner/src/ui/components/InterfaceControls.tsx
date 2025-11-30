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

  const handleSwitchView = (view: string) => {
    const inst = bp();
    if (!inst) return;
    try {
      inst.three.switchView(view);
    } catch (e) {
      // ignore
    }
  };

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
    const legacy = document.querySelector(
      "#interfaces #showAddItems"
    ) as HTMLElement | null;
    if (legacy) legacy.click();
  };

  return (
    <div id="interface-controls" className="flex flex-col gap-2 items-center">
      <div className="btn-group-vertical" id="viewcontrols">
        <div className="btn btn-sm btn-default">
          <a
            className="btn btn-default bottom"
            href="#"
            id="leftview"
            onClick={(e) => {
              e.preventDefault();
              handleSwitchView("leftview");
            }}
            title="Вид слева"
          >
            <span className="glyphicon glyphicon-object-align-left" />
          </a>

          <span className="btn-group-vertical">
            <a
              className="btn btn-default"
              href="#"
              id="topview"
              onClick={(e) => {
                e.preventDefault();
                handleSwitchView("topview");
              }}
              title="Вид сверху"
            >
              <span className="glyphicon glyphicon-object-align-horizontal" />
            </a>
            <a
              className="btn btn-default"
              href="#"
              id="isometryview"
              onClick={(e) => {
                e.preventDefault();
                handleSwitchView("isometryview");
              }}
              title="3D вид"
            >
              <span className="glyphicon glyphicon-inbox" />
            </a>
            <a
              className="btn btn-default"
              href="#"
              id="frontview"
              onClick={(e) => {
                e.preventDefault();
                handleSwitchView("frontview");
              }}
              title="Вид спереди"
            >
              <span className="glyphicon glyphicon-object-align-vertical" />
            </a>
          </span>

          <a
            className="btn btn-default bottom"
            href="#"
            id="rightview"
            onClick={(e) => {
              e.preventDefault();
              handleSwitchView("rightview");
            }}
            title="Вид справа"
          >
            <span className="glyphicon glyphicon-object-align-right" />
          </a>
        </div>

        <button
          id="showSwitchCameraMode"
          onClick={handleSwitchCameraMode}
          className="btn btn-sm btn-default"
          title="Переключить камеру (ортогональная/перспектива)"
        >
          <span className="glyphicon glyphicon-camera" />
        </button>

        <button
          id="showSwitchWireframeMode"
          onClick={handleSwitchWireframeMode}
          className="btn btn-sm btn-default"
          title="Переключить каркасный режим"
        >
          <span className="glyphicon glyphicon-pencil" />
        </button>
        <button
          id="showAddItems"
          onClick={handleShowAddItems}
          className="btn btn-sm btn-default"
          data-toggle="modal"
          data-target="#add-items-modal"
          title="Добавить/Удалить предметы в 3D"
        >
          <span className="glyphicon glyphicon-plus" />
        </button>
      </div>

      <div>
        <button
          id="showFloorPlan"
          onClick={() => onViewModeChange("2d")}
          className={
            "btn btn-sm btn-default " + (viewMode === "2d" ? "active" : "")
          }
          title="Редактировать 2D планировку"
        >
          <span className="glyphicon glyphicon-move"></span> План этажа
        </button>
        <button
          id="showDesign"
          onClick={() => onViewModeChange("3d")}
          className={
            "btn btn-sm btn-default " + (viewMode === "3d" ? "active" : "")
          }
          title="Редактировать 3D планировку"
        >
          <span className="glyphicon glyphicon-move"></span> 3D
        </button>
      </div>
    </div>
  );
}

