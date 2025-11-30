import { useEffect } from "react";

export default function LegacyBootstrap() {
  useEffect(() => {
    // Try to import the JS modules from src/scripts to construct BlueprintJS instance.
    // If the older build artifacts are still used, fallback to loading legacy built assets.

    async function init() {
      // Tell the legacy runtime that React will provide UI handlers.
      // Legacy `planner/js/app.js` checks this flag to avoid registering its
      // jQuery-based event handlers so we can handle them in React.
      // @ts-ignore
      window.USE_REACT_CONTROLS = true;
      try {
        // Используем относительный путь - Vite должен его разрешить
        // @ts-expect-error - динамический импорт JS модуля из TS
        const mod = await import("../../scripts/blueprint.js");

        console.log("Blueprint module loaded:", mod);

        // blueprint module exports BlueprintJS (named export)
        if (mod && mod.BlueprintJS) {
          // Create an instance and attach to DOM elements already present
          const Blueprint = mod.BlueprintJS;
          // expose the module as a global for legacy code compatibility
          // @ts-ignore
          window.BP3DJS = mod;
          // opts similar to original
          const opts = {
            floorplannerElement: "floorplanner-canvas",
            threeElement: "#viewer",
            threeCanvasElement: "three-canvas",
            textureDir: "models/textures/",
            widget: false,
          };
          try {
            // @ts-ignore
            const instance = new Blueprint(opts);
            // if instance created, you may want to store to window for debugging
            // @ts-ignore
            window.blueprint3d = instance;
            console.log("BlueprintJS instantiated from src/scripts");
            return;
          } catch (err) {
            console.error("BlueprintJS instantiation failed:", err);
            throw err; // пробрасываем ошибку дальше
          }
        } else {
          console.warn(
            "BlueprintJS export not found in module:",
            Object.keys(mod || {})
          );
        }
      } catch (e) {
        console.error(
          "Importing blueprint.js failed — will try falling back to legacy built scripts",
          e
        );
      }

      // fallback: sequentially load legacy built JS files from build/js if present
      // Use CDN for vendor libs (keeps repo small) then load local build artifacts that we keep in public/js
      const legacyFiles = [
        // prefer local vendor builds from /js/lib served from public/ (faster and more reliable)
        "/js/lib/jquery-2.1.4.min.js",
        "/js/lib/jquery.flip.min.js",
        "/js/lib/dat.gui.min.js",
        "/js/lib/quicksettings.min.js",
        // Bootstrap removed - using Tailwind CSS instead
        // load library bundle before UI scripts
        "/js/bp3djs.js",
        // legacy UI helpers and glue
        "/js/items.js",
        "/js/items_gltf.js",
        "/js/app.js",
      ];

      for (const f of legacyFiles) {
        if (!document.querySelector(`script[src="${f}"]`)) {
          const s = document.createElement("script");
          s.src = f;
          s.async = false;
          document.body.appendChild(s);
          // wait for script to actually load before continuing
          await new Promise<void>((resolve, reject) => {
            s.onload = () => resolve();
            s.onerror = () => reject(new Error("Failed to load " + f));
          });
        }
      }
    }

    init();
  }, []);

  return null;
}
