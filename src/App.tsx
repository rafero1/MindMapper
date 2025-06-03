import "./App.css";
import { useState } from "react";
import { Layer, Stage } from "react-konva";
import FloatingMenu from "./components/ui/floatingMenu/menu";
import type { MapNode } from "./stores/types";
import { useMapNodeStore } from "./stores/nodeStore";
import CanvasNode from "./components/canvas/node/canvasNode";
import NodeConnection from "./components/canvas/connection/connection";

/**
 * TODO:
 *
 * Close menu when clicking outside
 *
 * Delete node function (what happens to connections?)
 *
 * Choose node text when creating
 *
 * Improve menu Styling
 * Node customization (size, color, etc)
 * Node long description (rich text)
 * Node icons
 *
 * Connection customization (dashed, solid, etc.)
 * Connection labels
 *
 * Cursor pointer on node hover (lol why is this hard)
 *
 * Move camera (pan) and zoom functionality in canvas
 *
 * Consider removing dragging and automatically place nodes in a grid (pathfinding)
 * - Autosize nodes based on text length
 * - Calculate new node position based on current nodes in grid
 */

function App() {
  const { nodes, updatePosition } = useMapNodeStore((state) => state);

  const [isNodeMenuOpen, setIsNodeMenuOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [nodeMenuPosition, setNodeMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  return (
    <>
      <FloatingMenu
        open={isNodeMenuOpen}
        selectedNode={selectedNode}
        onClose={() => setIsNodeMenuOpen(false)}
        x={nodeMenuPosition.x}
        y={nodeMenuPosition.y}
      />
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {Object.values(nodes)
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
          {Object.values(nodes).map((node) => (
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
      </Stage>
    </>
  );
}

export default App;
