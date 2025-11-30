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

  const activeStyle = "btn-primary disabled";

  return (
    <div id="floorplanner-controls">
      <a
        href="#"
        className="btn btn-default btn-sm glyphicon glyphicon-floppy-disk"
        id="new2d"
        title="Новая планировка"
        onClick={(e) => e.preventDefault()}
      />

      <a
        href="#"
        className="btn btn-default btn-sm glyphicon glyphicon-floppy-save"
        id="saveFile2d"
        title="Сохранить планировку"
        onClick={(e) => e.preventDefault()}
      />

      <a className="btn btn-sm btn-default btn-file glyphicon glyphicon-floppy-open">
        <input
          type="file"
          className="hidden-input"
          id="loadFile2d"
          title="Загрузить планировку"
        />
      </a>

      <a
        href="#"
        className="btn btn-default btn-sm glyphicon glyphicon-cloud-upload"
        id="loadDesignFromImage"
        title="Загрузить планировку из изображения"
        onClick={(e) => e.preventDefault()}
      />

      <button
        id="move"
        className={`btn btn-sm btn-default ${
          mode === "move" ? activeStyle : ""
        }`}
        title="Переместить стены"
        onClick={() => handleModeClick("move")}
      >
        <span className="glyphicon glyphicon-move" />
      </button>

      <button
        id="draw"
        className={`btn btn-sm btn-default ${
          mode === "draw" ? activeStyle : ""
        }`}
        title="Нарисовать новые стены"
        onClick={() => handleModeClick("draw")}
      >
        <span className="glyphicon glyphicon-pencil" />
      </button>

      <button
        id="delete"
        className={`btn btn-sm btn-default ${
          mode === "delete" ? activeStyle : ""
        }`}
        title="Удалить стены"
        onClick={() => handleModeClick("delete")}
      >
        <span className="glyphicon glyphicon-remove" />
      </button>

      <button
        id="help2d"
        className="btn btn-sm btn-default"
        title={`Подсказки\nShift: Привязка к осям и сетке\nESC: Остановить рисование стен\nДвойной клик (Угол): Изменить высоту\nКлик (Комната): Изменить название`}
        onClick={(e) => e.preventDefault()}
      >
        <span className="glyphicon glyphicon-info-sign" />
      </button>
    </div>
  );
}
