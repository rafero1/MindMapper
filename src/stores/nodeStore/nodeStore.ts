import { create } from "zustand";
import {
  type Graph,
  type GraphNodeMap,
  type GraphNode,
  DEFAULT_GRAPH,
  DEFAULT_GRAPHNODE_MAP,
} from "./types";

/**
 * delete the node and turn its children into new root nodes
 */
type Orphan = "orphan";

/**
 * delete the node and reparent its children to the node's parent, if it exists
 */
type Reparent = "reparent";

/**
 * delete the node and all its descendants
 */
type Cascade = "cascade";

type DeleteMode = Orphan | Reparent | Cascade;

type UpdateOptions = {
  skipHistory?: boolean;
};

interface GraphState {
  graphs: Graph[];
  activeGraph: Graph | null;
  nodes: GraphNodeMap;
  snapshot: GraphNodeMap | null;
  history: GraphNodeMap[];
  future: GraphNodeMap[];
  setGraphs: (graphs: Graph[]) => void;
  setActiveGraph: (graph: Graph, nodes: GraphNodeMap) => void;
  addGraph: (newGraph: Graph) => void;
  renameGraph: (id: string, newTitle: string) => void;
  updateLastOpenedDateGraph: (id: string) => void;
  deleteGraph: (id: string) => void;
  addNode: (newNode: GraphNode) => void;
  updateNodePosition: (
    id: string,
    x: number,
    y: number,
    options?: UpdateOptions
  ) => void;
  deleteNode: (id: string, deleteMode?: DeleteMode) => void;
  updateNodeText: (id: string, text: string) => void;
  createSnapshot: () => void;
  updateHistory: () => void;
  undo: () => void;
  redo: () => void;
}

/**
 * builds and returns a map of parentId: [children]
 * @param nodes the NodeMap
 */
function mapNodesToChildren(nodes: GraphNodeMap) {
  const childIndex: { [parentId: string]: GraphNode[] } = {};
  for (const nodeId in nodes) {
    const node = nodes[nodeId];
    if (node.parentId) {
      if (!childIndex[node.parentId]) {
        childIndex[node.parentId] = [];
      }
      childIndex[node.parentId].push(node);
    }
  }
  return childIndex;
}

/**
 * returns all of the descendants of a node
 * @param nodes the NodeMap
 * @param parentId the id of the parent
 * @returns array of descendants
 */
export function getDescendants(nodes: GraphNodeMap, parentId: string) {
  const childIndex = mapNodesToChildren(nodes);
  const descendants: GraphNode[] = [];

  // Use a queue to perform a breadth-first search for descendants, starting from the parent
  const queue: string[] = [parentId];
  const processedIds = new Set<string>();
  let head = 0;
  while (head < queue.length) {
    const currentId = queue[head++];
    const children = childIndex[currentId];

    if (!children) continue;

    for (const child of children) {
      if (!processedIds.has(child.id)) {
        processedIds.add(child.id);
        queue.push(child.id);
        descendants.push(child);
      }
    }
  }
  return descendants;
}

export const useGraphStore = create<GraphState>((set) => ({
  graphs: [],
  activeGraph: DEFAULT_GRAPH,
  nodes: DEFAULT_GRAPHNODE_MAP,
  snapshot: {},
  history: [],
  future: [],
  setActiveGraph: (graph: Graph, nodes: GraphNodeMap) =>
    set((state) => ({
      ...state,
      activeGraph: graph,
      nodes,
      history: [],
      future: [],
    })),
  setGraphs: (graphs: Graph[]) => set((state) => ({ ...state, graphs })),
  addGraph: (newGraph: Graph) =>
    set((state) => ({
      graphs: [...state.graphs, newGraph],
    })),
  renameGraph: (id: string, newTitle: string) =>
    set((state) => ({
      graphs: state.graphs.map((graph) =>
        graph.id === id ? { ...graph, title: newTitle } : graph
      ),
    })),
  updateLastOpenedDateGraph: (id: string) =>
    set((state) => ({
      graphs: state.graphs.map((graph) =>
        graph.id === id ? { ...graph, lastModified: new Date() } : graph
      ),
    })),
  deleteGraph: (id: string) =>
    set((state) => ({
      graphs: [...state.graphs.filter((graph) => graph.id !== id)],
    })),
  addNode: (newNode: GraphNode) =>
    set((state) => {
      return {
        ...state,
        nodes: { ...state.nodes, [newNode.id]: newNode },
        history: [...state.history, state.nodes],
        future: [],
      };
    }),
  updateNodePosition: (
    id: string,
    newX: number,
    newY: number,
    options: UpdateOptions = { skipHistory: true }
  ) =>
    set((state) => ({
      nodes: { ...state.nodes, [id]: { ...state.nodes[id], x: newX, y: newY } },
      ...(!options?.skipHistory && {
        history: [...state.history, state.nodes],
        future: [],
      }),
    })),
  deleteNode: (id: string, deleteMode = "reparent") =>
    set((state) => {
      const updatedNodes = { ...state.nodes };
      switch (deleteMode) {
        case "orphan":
          delete updatedNodes[id];
          break;
        case "reparent": {
          const parentId = updatedNodes[id].parentId;
          delete updatedNodes[id];
          if (!parentId) break;

          const children = mapNodesToChildren(updatedNodes)[id];
          if (!children || children.length === 0) break;

          for (const child of children) {
            updatedNodes[child.id].parentId = parentId;
          }
          break;
        }
        case "cascade": {
          delete updatedNodes[id];
          const descendants = getDescendants(updatedNodes, id);
          if (!descendants || descendants.length === 0) break;

          for (const child of descendants) {
            delete updatedNodes[child.id];
          }
          break;
        }
        default:
          break;
      }
      return {
        ...state,
        nodes: updatedNodes,
        history: [...state.history, state.nodes],
        future: [],
      };
    }),
  updateNodeText: (id: string, newText: string) =>
    set((state) => ({
      ...state,
      nodes: { ...state.nodes, [id]: { ...state.nodes[id], text: newText } },
      history: [...state.history, state.nodes],
      future: [],
    })),
  createSnapshot: () =>
    set((state) => ({
      ...state,
      snapshot: { ...state.nodes },
    })),
  updateHistory: () =>
    set((state) => ({
      ...state,
      history: [...state.history, state.nodes],
      future: [],
    })),
  undo: () =>
    set((state) => {
      if (state.history.length === 0) return state;
      const currentState = state.nodes;
      const lastState = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      const newFuture = [currentState, ...state.future];
      return {
        ...state,
        nodes: lastState,
        history: newHistory,
        future: newFuture,
      };
    }),
  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const currentState = state.nodes;
      const nextState = state.future[0];
      const newHistory = [...state.history, currentState];
      const newFuture = state.future.slice(1);
      return {
        ...state,
        nodes: nextState,
        history: newHistory,
        future: newFuture,
      };
    }),
}));
