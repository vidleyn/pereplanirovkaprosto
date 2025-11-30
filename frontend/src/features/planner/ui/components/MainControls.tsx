import React from "react";

interface MainControlsProps {
  blueprint3d: any;
}

export default function MainControls({ blueprint3d }: MainControlsProps) {
  return (
    <div id="main-controls">
      <a
        href="#"
        className="btn btn-default btn-sm glyphicon glyphicon-floppy-disk"
        id="new"
        title="Новая планировка"
        onClick={(e) => e.preventDefault()}
      />

      <a
        href="#"
        className="btn btn-default btn-sm glyphicon glyphicon-floppy-save"
        id="saveFile"
        title="Сохранить планировку"
        onClick={(e) => e.preventDefault()}
      />

      <a className="btn btn-sm btn-default btn-file glyphicon glyphicon-floppy-open">
        <input type="file" className="hidden-input" id="loadFile" />
      </a>

      <a
        href="#"
        className="btn btn-default btn-sm glyphicon glyphicon-asterisk"
        id="saveMesh"
        title="Сохранить сцену как mesh"
        onClick={(e) => e.preventDefault()}
      />

      <a
        href="#"
        className="btn btn-default btn-sm glyphicon glyphicon-export"
        id="saveGLTF"
        title="Сохранить сцену как GLTF"
        onClick={(e) => e.preventDefault()}
      />
    </div>
  );
}

