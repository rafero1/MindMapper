import "./App.css";
import { useState } from "react";
import { Layer } from "react-konva";
import FloatingMenu from "./components/ui/floatingMenu/menu";
import type { TreeNode } from "./stores/nodeStore/types";
import { useTreeNodeStore } from "./stores/nodeStore/nodeStore";
import CanvasNode from "./components/canvas/node/canvasNode";
import NodeConnection from "./components/canvas/connection/connection";
import InteractiveStage from "./components/canvas/interactiveStage/interactiveStage";
import InfoPanel from "./components/ui/infoPanel/infoPanel";
import { useSettingsStore } from "./stores/settingsStore/settingsStore";

/**
 * TODO:
 *
 * Improve menu Styling
 * - Close floating node menu when clicking outside
 *
 * Choose node text when creating
 * When creating node, place it in an appropriate position
 * Manual reparenting of nodes (dragging a node onto another node)
 *
 * Select which type of deletion to perform when deleting (orphan, reparent, cascade)
 *
 * Node customization (size, color, icon, etc)
 * - Node long description (rich text)
 *
 * Connection customization (icon, size, color, dashed, solid, etc.)
 * - Connection labels
 *
 * Cursor pointer on node hover (lol why is this hard)
 *
 * Grid
 * - Grid snapping when dragging nodes
 *
 * Save and load tree structure to JSON
 * - Save to indexedDB
 *
 * Consider removing dragging and automatically place nodes in a grid (pathfinding)
 * - Autosize nodes based on text length
 * - Calculate new node position based on current nodes in grid
 */

function App() {
  const { nodes, updateNodePosition: updatePosition } = useTreeNodeStore(
    (state) => state
  );

  const nodeArray = Object.values(nodes);

  const [isNodeMenuOpen, setIsNodeMenuOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [nodeMenuPosition, setNodeMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const { zoomLevel } = useSettingsStore();

  return (
    <>
      <FloatingMenu
        open={isNodeMenuOpen}
        selectedNode={selectedNode}
        onClose={() => setIsNodeMenuOpen(false)}
        x={nodeMenuPosition.x}
        y={nodeMenuPosition.y}
      />
      <InfoPanel
        data={[
          { label: "Node Count", value: nodeArray.length },
          { label: "Zoom Level", value: zoomLevel.toPrecision(2) + "x" },
        ]}
      />
      <InteractiveStage>
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
                event.cancelBubble = true;
                setSelectedNode(node);
                setNodeMenuPosition({
                  x: event.evt.clientX,
                  y: event.evt.clientY,
                });
                setIsNodeMenuOpen(true);
              }}
              onDragMove={(event) => {
                const newX = event.target.x();
                const newY = event.target.y();
                updatePosition(node.id, newX, newY);
              }}
            />
          ))}
        </Layer>
      </InteractiveStage>
    </>
  );
}

export default App;
