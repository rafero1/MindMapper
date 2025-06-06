import "./App.css";
import { useCallback, useRef, useState } from "react";
import { Layer } from "react-konva";
import FloatingMenu from "./components/ui/floatingMenu/menu";
import type { TreeNode } from "./stores/nodeStore/types";
import { useTreeNodeStore } from "./stores/nodeStore/nodeStore";
import CanvasNode from "./components/canvas/node/canvasNode";
import NodeConnection from "./components/canvas/connection/connection";
import InteractiveStage from "./components/canvas/interactiveStage/interactiveStage";
import InfoPanel from "./components/ui/infoPanel/infoPanel";
import { useSettingsStore } from "./stores/settingsStore/settingsStore";
import type { KonvaEventObject } from "konva/lib/Node";

/**
 * TODO:
 *
 * Select and grab multiple nodes
 * Manual reparenting of nodes (dragging a node onto another node)
 * Save and load tree structure to JSON
 * - Save to indexedDB
 *
 * Select which type of deletion to perform when deleting (orphan, reparent, cascade)
 *
 * Improve menu Styling
 *
 * Choose node text when creating
 *
 * Node customization (size, color, icon, etc)
 * - Node long description (rich text)
 *
 * Connection customization (icon, size, color, dashed, solid, etc.)
 * - Connection labels
 *
 * When creating node, place it in an appropriate position
 *
 * Grid
 * - Grid snapping when dragging nodes
 *
 * Consider removing dragging and automatically place nodes in a grid (pathfinding)
 * - Autosize nodes based on text length
 * - Calculate new node position based on current nodes in grid
 */

interface NodeMenuState {
  selectedNode: TreeNode | null;
  position: {
    x: number;
    y: number;
  };
}

function App() {
  const { zoomLevel } = useSettingsStore();
  const { nodes } = useTreeNodeStore((state) => state);
  const nodeArray = Object.values(nodes);

  const [nodeMenuState, setNodeMenuState] = useState<NodeMenuState>({
    selectedNode: null,
    position: { x: 0, y: 0 },
  });

  const floatingMenuRef = useRef<HTMLDivElement | null>(null);

  const handleClick = useCallback(
    (event: KonvaEventObject<MouseEvent>) => {
      if (
        nodeMenuState.selectedNode &&
        !floatingMenuRef.current?.contains(event.evt.target as Node)
      ) {
        setNodeMenuState({ selectedNode: null, position: { x: 0, y: 0 } });
      }
    },
    [nodeMenuState.selectedNode]
  );

  return (
    <>
      <FloatingMenu
        open={Boolean(nodeMenuState.selectedNode)}
        selectedNode={nodeMenuState.selectedNode}
        onClose={() =>
          setNodeMenuState({ selectedNode: null, position: { x: 0, y: 0 } })
        }
        x={nodeMenuState.position.x}
        y={nodeMenuState.position.y}
        ref={floatingMenuRef}
      />
      <InfoPanel
        data={[
          { label: "Node Count", value: nodeArray.length },
          { label: "Zoom Level", value: zoomLevel.toPrecision(2) + "x" },
        ]}
      />
      <InteractiveStage onStageClick={handleClick}>
        <Layer>
          {nodeArray
            .filter((node) => node.parentId)
            .map((node) => {
              if (!node.parentId) {
                return null;
              }
              const parent = nodes[node.parentId];
              return parent ? (
                <NodeConnection
                  key={parent.id + "-to-" + node.id + "-line"}
                  parent={parent}
                  node={node}
                />
              ) : null;
            })}
        </Layer>
        <Layer>
          {nodeArray.map((node) => (
            <CanvasNode
              key={node.id}
              node={node}
              onClick={(event) => {
                setNodeMenuState({
                  selectedNode: node,
                  position: { x: event.evt.clientX, y: event.evt.clientY },
                });
              }}
            />
          ))}
        </Layer>
      </InteractiveStage>
    </>
  );
}

export default App;
