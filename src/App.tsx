import { useEffect, useState } from "react";
import "./App.css";
import { Circle, Group, Layer, Line, Stage, Text } from "react-konva";
import FloatingMenu from "./components/ui/floatingMenu/menu";
import type { MapNode } from "./stores/types";
import { useMapNodeStore } from "./stores/nodeStore";

/**
 * TODO:
 *
 * Separate into components
 * Add node deletion
 * close menu when clicking outside
 * Improve menu component
 */

function App() {
  const nodes = useMapNodeStore((state) => state.nodes);
  const { addNode, updatePosition, updateText } = useMapNodeStore(
    (state) => state
  );

  const [menuX, setMenuX] = useState(0);
  const [menuY, setMenuY] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [targettedNode, setTargettedNode] = useState<MapNode | null>(null);

  return (
    <>
      <FloatingMenu
        open={isMenuVisible}
        x={menuX}
        y={menuY}
        onRename={() => {
          if (!targettedNode) {
            return;
          }
          const newText = prompt("Enter new text:", targettedNode.text);
          if (!newText || newText.trim() === "") {
            return;
          }
          updateText(targettedNode.id, newText);
          setIsMenuVisible(false);
        }}
        onAdd={() => {
          setIsMenuVisible(false);

          // Create a new node
          if (!targettedNode) {
            return;
          }

          const x = targettedNode.x + 200;
          const y = targettedNode.y;
          const newNode = {
            id: `node-${Math.random().toString(36).slice(2, 9)}`,
            x: x,
            y: y,
            text: `Node`,
            parentId: targettedNode ? targettedNode.id : undefined,
          };
          addNode(newNode);
        }}
        onDelete={() => console.log("Delete clicked")}
        onClose={() => setIsMenuVisible(false)}
        targetNode={targettedNode}
      />
      <Stage width={window.innerWidth} height={window.innerHeight - 200}>
        <Layer>
          {Object.values(nodes)
            .filter((node) => node.parentId)
            .map((node) => {
              if (!node.parentId) return null;
              const parent = nodes[node.parentId];
              return parent ? (
                <Line
                  key={parent.id + "-to-" + node.id + "-line"}
                  points={[parent.x, parent.y, node.x, node.y]}
                  stroke="black"
                  strokeWidth={3}
                />
              ) : null;
            })}
        </Layer>
        <Layer>
          {Object.values(nodes).map((node) => (
            <Group
              key={node.id}
              id={node.id}
              x={node.x}
              y={node.y}
              draggable
              onClick={(event) => {
                event.cancelBubble = true;
                setMenuX(event.evt.clientX);
                setMenuY(event.evt.clientY);
                setIsMenuVisible(true);
                setTargettedNode(node);
              }}
              onDragMove={(event) => {
                const newX = event.target.x();
                const newY = event.target.y();
                updatePosition(node.id, newX, newY);
              }}
            >
              <Circle radius={60} fill="white" stroke="black" strokeWidth={1} />
              {node.text && (
                <Text
                  key={node.id + "-text"}
                  text={node.text}
                  fontSize={20}
                  fill="black"
                  width={120}
                  height={120}
                  x={-60}
                  y={-60}
                  verticalAlign="middle"
                  align="center"
                />
              )}
            </Group>
          ))}
        </Layer>
      </Stage>
    </>
  );
}

export default App;
