import { useEffect, useState } from "react";
import { useSettingsStore } from "../../../stores/settingsStore/settingsStore";
import { getBoolean, setBoolean } from "../../../utils/localStorage";
import { useGraphStore } from "../../../stores/nodeStore/nodeStore";
import {
  DEFAULT_GRAPHNODE_MAP,
  generateNodeId,
} from "../../../stores/nodeStore/types";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/16/solid";
import { DbService } from "../../../stores/db";

const ActionBar = () => {
  const settings = useSettingsStore((state) => state.settings);
  const setGridEnabled = useSettingsStore((state) => state.setGridEnabled);
  const toggleGrid = useSettingsStore((state) => state.toggleGrid);

  const activeGraph = useGraphStore((state) => state.activeGraph);
  const addNode = useGraphStore((state) => state.addNode);

  const history = useGraphStore((state) => state.history);
  const future = useGraphStore((state) => state.future);
  const undo = useGraphStore((state) => state.undo);
  const redo = useGraphStore((state) => state.redo);
  const currentNodes = useGraphStore((state) => state.nodes);

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

  const undoButtonClicked = () => {
    if (activeGraph === null) {
      return;
    }
    undo();
    DbService.Graphs.replaceAllNodes(activeGraph.id, currentNodes).catch(
      (err) => {
        console.error("Failed to update nodes in DB after undo:", err);
      }
    );
    console.log("Undo action performed.");
  };

  const redoButtonClicked = () => {
    if (activeGraph === null) {
      return;
    }
    redo();
    DbService.Graphs.replaceAllNodes(activeGraph.id, currentNodes).catch(
      (err) => {
        console.error("Failed to update nodes in DB after redo:", err);
      }
    );
    console.log("Redo action performed.");
  };

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
            id: generateNodeId(),
            graphId: activeGraph.id,
          };
          addNode(node);
        }}
      >
        Create Root Node
      </button>
      <button
        className="flex items-center gap-1"
        title="Undo"
        disabled={history.length === 0}
        onClick={undoButtonClicked}
      >
        <ArrowUturnLeftIcon className="w-4" />
      </button>
      <button
        className="flex items-center gap-1"
        title="Redo"
        disabled={future.length === 0}
        onClick={redoButtonClicked}
      >
        <ArrowUturnRightIcon className="w-4" />
      </button>
    </div>
  );
};

export default ActionBar;
