// Modern Architect3D App - No jQuery dependency
// ES6+ with native DOM APIs

let blueprint3d = null;
let aGlobal = null;
let anItem = null;
let aWall = null;
let aFloor = null;
let aCameraRange = null;
let gui = null;
let globalPropFolder = null;
let itemPropFolder = null;
let wallPropFolder = null;
let floorPropFolder = null;
let cameraPropFolder = null;
let selectionsFolder = null;


const myhome = '{"floorplan":{"corners":{"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":0,"y":0,"elevation":4},"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":0,"y":5,"elevation":2.5},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":5,"y":5,"elevation":2.5},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":5,"y":0,"elevation":4}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"rooms":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e,71d4f128-ae80-3d58-9bd2-711c6ce6cdf2,4e3d65cb-54c0-0681-28bf-bddcc7bdb571,da026c08-d76a-a944-8e7b-096b752da9ed":{"name":"A New Room"}},"wallTextures":[],"floorTextures":{},"newFloorTextures":{},"carbonSheet":{"url":"","transparency":1,"x":0,"y":0,"anchorX":0,"anchorY":0,"width":0.01,"height":0.01}},"items":[]}';

// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// DOM helpers
const addClass = (el, className) => el?.classList.add(className);
const removeClass = (el, className) => el?.classList.remove(className);
const toggleClass = (el, className) => el?.classList.toggle(className);
const hasClass = (el, className) => el?.classList.contains(className);
const show = (el) => { if (el) el.style.display = ''; };
const hide = (el) => { if (el) el.style.display = 'none'; };

/*
 * Floorplanner controls
 */
class ViewerFloorplanner {
  constructor(blueprint3d) {
    this.floorplanner = blueprint3d.floorplanner;
    this.canvasWrapper = $('#floorplanner');
    this.move = $('#move');
    this.remove = $('#delete');
    this.draw = $('#draw');
    this.activeStyle = 'active';
    
    this.init();
  }

  init() {
    window.addEventListener('resize', () => this.handleWindowResize());
    this.handleWindowResize();

    this.floorplanner.addEventListener(BP3DJS.EVENT_MODE_RESET, (mode) => {
      removeClass(this.draw, this.activeStyle);
      removeClass(this.remove, this.activeStyle);
      removeClass(this.move, this.activeStyle);
      
      if (mode === BP3DJS.floorplannerModes.MOVE) {
        addClass(this.move, this.activeStyle);
      } else if (mode === BP3DJS.floorplannerModes.DRAW) {
        addClass(this.draw, this.activeStyle);
      } else if (mode === BP3DJS.floorplannerModes.DELETE) {
        addClass(this.remove, this.activeStyle);
      }

      const hint = $('#draw-walls-hint');
      if (mode === BP3DJS.floorplannerModes.DRAW) {
        addClass(hint, 'show');
        this.handleWindowResize();
      } else {
        removeClass(hint, 'show');
      }
    });

    this.move?.addEventListener('click', () => {
      this.floorplanner.setMode(BP3DJS.floorplannerModes.MOVE);
    });

    this.draw?.addEventListener('click', () => {
      this.floorplanner.setMode(BP3DJS.floorplannerModes.DRAW);
    });

    this.remove?.addEventListener('click', () => {
      this.floorplanner.setMode(BP3DJS.floorplannerModes.DELETE);
    });
  }

  updateFloorplanView() {
    this.floorplanner.reset();
  }

  handleWindowResize() {
    if (this.canvasWrapper) {
      const offsetTop = this.canvasWrapper.offsetTop || 0;
      this.canvasWrapper.style.height = `${window.innerHeight - offsetTop}px`;
    }
    this.floorplanner.resizeView();
  }
}

class MainControls {
  constructor(blueprint3d) {
    this.blueprint3d = blueprint3d;
    this.init();
  }

  newDesign() {
    this.blueprint3d.model.loadSerialized(myhome);
  }

  loadDesign(fileInput) {
    const files = fileInput?.files;
    if (!files || files.length === 0) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      this.blueprint3d.model.loadSerialized(data);
    };
    reader.readAsText(files[0]);
  }

  saveDesign() {
    const data = this.blueprint3d.model.exportSerialized();
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design.blueprint3d';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  saveGLTF() {
    this.blueprint3d.three.exportForBlender();
  }

  saveGLTFCallback(o) {
    const data = o.gltf;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design.gltf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  saveMesh() {
    const data = this.blueprint3d.model.exportMeshAsObj();
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design.obj';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  init() {
    $('#new')?.addEventListener('click', () => this.newDesign());
    $('#new2d')?.addEventListener('click', () => this.newDesign());
    $('#loadFile')?.addEventListener('change', (e) => this.loadDesign(e.target));
    $('#saveFile')?.addEventListener('click', () => this.saveDesign());
    $('#loadFile2d')?.addEventListener('change', (e) => this.loadDesign(e.target));
    $('#saveFile2d')?.addEventListener('click', () => this.saveDesign());
    $('#saveMesh')?.addEventListener('click', () => this.saveMesh());
    $('#saveGLTF')?.addEventListener('click', () => this.saveGLTF());
    
    this.blueprint3d.three.addEventListener(BP3DJS.EVENT_GLTF_READY, (o) => this.saveGLTFCallback(o));
  }
}

class GlobalProperties {
  constructor() {
    this.name = 'Global';
    this.units = { a: false, b: false, c: false, d: false, e: true };
    this.unitslabel = {
      a: BP3DJS.dimFeetAndInch,
      b: BP3DJS.dimInch,
      c: BP3DJS.dimCentiMeter,
      d: BP3DJS.dimMilliMeter,
      e: BP3DJS.dimMeter
    };
    this.guiControllers = null;
  }

  setUnit(unit) {
    Object.keys(this.units).forEach(param => {
      this.units[param] = false;
    });
    this.units[unit] = true;
    BP3DJS.Configuration.setValue(BP3DJS.configDimUnit, this.unitslabel[unit]);
    
    const view2df = construct2dInterfaceFolder(globalPropFolder, this, blueprint3d.floorplanner);
    blueprint3d.floorplanner.view.draw();
    
    if (this.guiControllers) {
      this.guiControllers.forEach(controller => controller.updateDisplay());
    }
  }

  setGUIControllers(guiControls) {
    this.guiControllers = guiControls;
  }
}

class CameraProperties {
  constructor() {
    this.ratio = 1;
    this.ratio2 = 1;
    this.locked = false;
    this.three = null;
  }

  change() {
    if (this.three) {
      this.three.changeClippingPlanes(this.ratio, this.ratio2);
    }
  }

  changeLock() {
    if (this.three) {
      this.three.lockView(!this.locked);
    }
  }

  reset() {
    if (this.three) {
      this.three.resetClipping();
    }
  }
}

// Modal management
class ModalManager {
  constructor() {
    this.modal = $('#add-items-modal');
    this.init();
  }

  init() {
    const closeButtons = $$('.modal-close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Inventory section toggles
    const inventoryHeaders = $$('.inventory-header');
    inventoryHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const section = header.closest('.inventory-section');
        toggleClass(section, 'active');
      });
    });
  }

  open() {
    if (this.modal) {
      addClass(this.modal, 'active');
      this.modal.setAttribute('aria-hidden', 'false');
    }
  }

  close() {
    if (this.modal) {
      removeClass(this.modal, 'active');
      this.modal.setAttribute('aria-hidden', 'true');
    }
  }
}

// View switching
class ViewManager {
  constructor(blueprint3d) {
    this.blueprint3d = blueprint3d;
    this.floorPlanView = $('#floorplanner');
    this.designView = $('#viewer');
    this.init();
  }

  init() {
    $('#showFloorPlan')?.addEventListener('click', () => this.showFloorPlan());
    $('#showDesign')?.addEventListener('click', () => this.showDesign());
    
    $('#showSwitchCameraMode')?.addEventListener('click', () => {
      const btn = $('#showSwitchCameraMode');
      toggleClass(btn, 'active');
      this.blueprint3d.three.switchOrthographicMode(hasClass(btn, 'active'));
    });

    $('#showSwitchWireframeMode')?.addEventListener('click', () => {
      const btn = $('#showSwitchWireframeMode');
      toggleClass(btn, 'active');
      this.blueprint3d.three.switchWireframe(hasClass(btn, 'active'));
    });

    const viewButtons = ['topview', 'isometryview', 'frontview', 'leftview', 'rightview'];
    viewButtons.forEach(viewId => {
      $(`#${viewId}`)?.addEventListener('click', () => {
        this.blueprint3d.three.switchView(viewId);
      });
    });
  }

  showFloorPlan() {
    removeClass(this.designView, 'active');
    addClass(this.floorPlanView, 'active');
    
    removeClass($('#showDesign'), 'active');
    addClass($('#showFloorPlan'), 'active');
    
    // Hide 3D view controls in 2D view
    hide($('#viewcontrols'));
    // Hide add items button in 2D view
    hide($('#showAddItems'));
    
    this.blueprint3d.three.pauseTheRendering(true);
    this.blueprint3d.three.getController()?.setSelectedObject(null);
  }

  showDesign() {
    // Update floorplan first
    this.blueprint3d.model.floorplan.update();
    
    // Ensure 3D scene is updated
    if (this.blueprint3d.three.floorplan) {
      this.blueprint3d.three.floorplan.redraw();
    }
    this.blueprint3d.three.ensureNeedsUpdate();
    
    removeClass(this.floorPlanView, 'active');
    addClass(this.designView, 'active');
    
    removeClass($('#showFloorPlan'), 'active');
    addClass($('#showDesign'), 'active');
    
    // Show all 3D view controls
    show($('#viewcontrols'));
    // Show add items button in 3D view
    show($('#showAddItems'));
    
    this.blueprint3d.three.pauseTheRendering(false);
    this.blueprint3d.three.switchFPSMode(false);
  }
}

// Initialize when DOM is ready
function init() {
  // Extend dat.GUI
  if (typeof dat !== 'undefined' && dat.GUI) {
    dat.GUI.prototype.removeFolder = function(name) {
      const folder = this.__folders[name];
      if (!folder) return;
      folder.close();
      if (this.__ul && folder.domElement?.parentNode) {
        this.__ul.removeChild(folder.domElement.parentNode);
      }
      delete this.__folders[name];
      this.onResize();
    };
  }

  // Main setup
  const opts = {
    floorplannerElement: 'floorplanner-canvas',
    threeElement: '#viewer',
    threeCanvasElement: 'three-canvas',
    textureDir: "models/textures/",
    widget: false
  };

  blueprint3d = new BP3DJS.BlueprintJS(opts);
  const viewerFloorplanner = new ViewerFloorplanner(blueprint3d);
  const mainControls = new MainControls(blueprint3d);
  const modalManager = new ModalManager();
  const viewManager = new ViewManager(blueprint3d);

  blueprint3d.model.addEventListener(BP3DJS.EVENT_LOADED, () => {
    console.log('LOAD SERIALIZED JSON ::: ');
  });

  // Listen for floorplan updates to refresh 3D scene
  blueprint3d.model.floorplan.addEventListener(BP3DJS.EVENT_UPDATED, () => {
    // Update 3D scene when floorplan changes
    if (blueprint3d.three.floorplan) {
      blueprint3d.three.floorplan.redraw();
    }
    if (blueprint3d.three.lights) {
      blueprint3d.three.lights.updateShadowCamera();
    }
    blueprint3d.three.ensureNeedsUpdate();
  });

  // Initialize default view
  viewManager.showFloorPlan();
  blueprint3d.model.loadSerialized(myhome);

  addBlueprintListeners(blueprint3d);
  datGUI(blueprint3d.three, blueprint3d.floorplanner);
  blueprint3d.three.stopSpin();

  // Setup add items button - only visible in 3D view
  $('#showAddItems')?.addEventListener('click', () => {
    modalManager.open();
  });

  // Setup item adding in 3D view
  const addItems = $('#add-items');
  if (addItems) {
    addItems.addEventListener('mousedown', (e) => {
      const addItem = e.target.closest('.add-item');
      if (!addItem) return;

      const modelUrl = addItem.getAttribute('model-url');
      const itemType = parseInt(addItem.getAttribute('model-type'));
      const itemFormat = addItem.getAttribute('model-format');
      const metadata = {
        itemName: addItem.getAttribute('model-name'),
        resizable: true,
        modelUrl: modelUrl,
        itemType: itemType,
        format: itemFormat,
      };

      console.log('Adding item in 3D:', metadata.itemName, 'Type:', itemType);

      // Add item to 3D scene
      // If wall/floor is selected, place on it, otherwise place in center
      if ([2, 3, 7, 9].indexOf(metadata.itemType) !== -1 && aWall?.currentWall) {
        // Wall items (doors, windows, etc.)
        const placeAt = aWall.currentWall.center.clone();
        blueprint3d.model.scene.addItem(itemType, modelUrl, metadata, null, null, null, false, {
          position: placeAt,
          edge: aWall.currentWall
        });
      } else if (aWall?.currentFloor) {
        // Floor items
        const placeAt = aWall.currentFloor.center.clone();
        blueprint3d.model.scene.addItem(itemType, modelUrl, metadata, null, null, null, false, {
          position: placeAt
        });
      } else {
        // Place in scene center or default position
        blueprint3d.model.scene.addItem(itemType, modelUrl, metadata);
      }

      // Close modal after adding
      modalManager.close();
    });
  }
}

// Keep existing functions that are used by the codebase
// (These would need to be imported or defined based on the actual codebase structure)
function addBlueprintListeners(blueprint3d) {
  // Implementation would go here - keeping structure from original
  const three = blueprint3d.three;
  let currentFolder = undefined;

  function closeCurrent3DSelectionFolders() {
    if (itemPropFolder) {
      itemPropFolder.close();
      selectionsFolder.removeFolder(itemPropFolder.name);
    }
    if (wallPropFolder) {
      wallPropFolder.close();
      selectionsFolder.removeFolder(wallPropFolder.name);
    }
  }

  function wallClicked(wall) {
    closeCurrent3DSelectionFolders();
    aWall = new WallProperties();
    aWall.setWall(wall);
    aWall.setFloor(null);
    wallPropFolder = getWallAndFloorPropertiesFolder(selectionsFolder, aWall);
    wallPropFolder.open();
    selectionsFolder.open();
  }

  function floorClicked(floor) {
    closeCurrent3DSelectionFolders();
    aWall = new WallProperties();
    aWall.setFloor(floor);
    aWall.setWall(null);
    wallPropFolder = getWallAndFloorPropertiesFolder(selectionsFolder, aWall);
    wallPropFolder.open();
    selectionsFolder.open();
  }

  function itemSelected(item) {
    closeCurrent3DSelectionFolders();
    anItem = new ItemProperties(selectionsFolder);
    anItem.setItem(item);
    itemPropFolder = getItemPropertiesFolder(selectionsFolder, anItem);
    itemPropFolder.open();
    selectionsFolder.open();
  }

  function itemUnselected() {
    closeCurrent3DSelectionFolders();
    if (anItem) {
      anItem.setItem(undefined);
    }
  }

  three.addEventListener(BP3DJS.EVENT_ITEM_SELECTED, (o) => itemSelected(o.item));
  three.addEventListener(BP3DJS.EVENT_ITEM_UNSELECTED, () => itemUnselected());
  three.addEventListener(BP3DJS.EVENT_WALL_CLICKED, (o) => wallClicked(o.item));
  three.addEventListener(BP3DJS.EVENT_FLOOR_CLICKED, (o) => floorClicked(o.item));
  three.addEventListener(BP3DJS.EVENT_FPS_EXIT, () => {
    $('#showDesign')?.click();
  });

  BP3DJS.Configuration.setValue(BP3DJS.configSystemUI, false);
}

// Placeholder functions - these would need to be implemented based on actual codebase
function datGUI(three, floorplanner) {
  gui = new dat.GUI();
  aCameraRange = new CameraProperties();
  aCameraRange.three = three;
  aGlobal = new GlobalProperties();
  globalPropFolder = getGlobalPropertiesFolder(gui, aGlobal, floorplanner);

  const f3d = globalPropFolder.addFolder('3D Editor');
  cameraPropFolder = getCameraRangePropertiesFolder(f3d, aCameraRange);

  const view2df = construct2dInterfaceFolder(globalPropFolder, aGlobal, floorplanner);
  view2df.open();

  selectionsFolder = gui.addFolder('Selections');
}

// These functions would need to be imported from the original codebase or reimplemented
function construct2dInterfaceFolder(f, global, floorplanner) { /* ... */ }
function getGlobalPropertiesFolder(gui, global, floorplanner) { /* ... */ }
function getCameraRangePropertiesFolder(gui, camerarange) { /* ... */ }
function getWallAndFloorPropertiesFolder(gui, aWall) { /* ... */ }
function getItemPropertiesFolder(gui, anItem) { /* ... */ }
function WallProperties() { /* ... */ }
function ItemProperties(gui) { /* ... */ }

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
