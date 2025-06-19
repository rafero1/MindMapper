import { useEffect, useState } from "react";
import { useSettingsStore } from "../../../stores/settingsStore/settingsStore";
import { getBoolean, setBoolean } from "../../../utils/localStorage";
import { useGraphStore } from "../../../stores/nodeStore/nodeStore";
import { DEFAULT_GRAPHNODE_MAP } from "../../../stores/nodeStore/types";

const ActionBar = () => {
  const { settings, setGridEnabled, toggleGrid } = useSettingsStore(
    (state) => state
  );

  const { activeGraph, addNode } = useGraphStore((state) => state);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      const gridEnabled = getBoolean("gridEnabled");
      if (gridEnabled !== null) {
        setGridEnabled(gridEnabled);
      }
      setLoaded(true);
    }
  }, [loaded, setGridEnabled]);

  useEffect(() => {
    if (loaded) {
      setBoolean("gridEnabled", settings.gridEnabled);
    }
  }, [loaded, settings.gridEnabled]);

  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10 w-auto flex flex-row gap-2 p-2 bg-stone-950/75 rounded-xl shadow-lg">
      <button
        onClick={() => {
          toggleGrid();
        }}
      >
        Toggle Grid
      </button>
      <button
        onClick={() => {
          if (!activeGraph) {
            return;
          }

          const node = {
            ...DEFAULT_GRAPHNODE_MAP.root,
            graphId: activeGraph.id,
          };
          addNode(node);
        }}
      >
        Create Root Node
      </button>
    </div>
  );
};

export default ActionBar;
