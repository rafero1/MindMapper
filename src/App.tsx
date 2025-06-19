import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Layer } from "react-konva";
import FloatingMenu from "./components/ui/floatingMenu/menu";
import {
  DEFAULT_GRAPH,
  DEFAULT_GRAPHNODE_MAP,
  generateNodeId,
  type GraphNode,
} from "./stores/nodeStore/types";
import { useGraphStore } from "./stores/nodeStore/nodeStore";
import CanvasNode from "./components/canvas/node/canvasNode";
import NodeConnection from "./components/canvas/connection/connection";
import InteractiveStage from "./components/canvas/interactiveStage/interactiveStage";
import type { KonvaEventObject } from "konva/lib/Node";
import UI from "./components/ui/ui/ui";
import { useLoadData } from "./hooks/useLoadData";
import { DbService } from "./stores/db";

/**
 * TODO:
 *
 * Support for multiple mind maps
 * - Export and import trees (JSON or XML)
 *
 * Add undo/redo functionality
 * Select which type of deletion to perform when deleting (orphan, reparent, cascade)
 * Manual reparenting of nodes (dragging a node onto another node)
 * - Drag node and children or just the node
 *
 * Write node text when creating node
 * - Autosize nodes based on text length
 * Node customization (size, color, icon, etc)
 * - Node long description (rich text)
 * Connection customization (icon, size, color, dashed, solid, etc.)
 * - Connection labels
 *
 * Dark/light mode toggle (change bg and menu colors)
 * Internationalization (i18n) support
 *
 * Grid
 * - Refactor grid to use buffering (infinite scrolling) rather than redrawing the grid lines
 * - Grid snapping when dragging nodes
 * - Consider removing dragging feature and automatically place nodes in a grid (pathfinding)
 * - Calculate new node position based on current nodes in grid
 *
 */

interface NodeMenuState {
  selectedNode: GraphNode | null;
  position: {
    x: number;
    y: number;
  };
}

function App() {
  const { nodes, setActiveGraph, setGraphs } = useGraphStore((state) => state);
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

  const { isLoading, data } = useLoadData();

  useEffect(() => {
    if (!isLoading) {
      console.log("Data loaded:", data);
      if (data.graphs && data.graphs.length > 0) {
        setGraphs(data.graphs);
        if (data.activeGraph && data.nodes) {
          setActiveGraph(data.activeGraph, data.nodes);
        }
      } else {
        // Initial state
        const graph = {
          ...DEFAULT_GRAPH,
          id: crypto.randomUUID(),
        };
        const rootNode = {
          ...DEFAULT_GRAPHNODE_MAP.root,
          id: generateNodeId(),
          graphId: graph.id,
        };
        const nodeMap = {
          [rootNode.id]: rootNode,
        };
        DbService.Graphs.insertOrUpdate(graph).catch((error) => {
          console.error("Failed to insert or update graph:", error);
        });
        DbService.Nodes.insertOrUpdate(rootNode).catch((error) => {
          console.error("Failed to insert or update root node:", error);
        });
        setGraphs([graph]);
        setActiveGraph(graph, nodeMap);
      }
    }
  }, [isLoading, data, setGraphs, setActiveGraph]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <h1>Loading...</h1>
      </div>
    );
  }

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
      <UI />
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
