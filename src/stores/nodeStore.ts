import { create } from "zustand";
import type { MapNode } from "./types";

interface NodeState {
  /**
   * Map of nodes where the key is the node ID and the value is the MapNode object.
   */
  nodes: { [id: string]: MapNode };
  addNode: (newNode: MapNode) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  deleteNode: (id: string) => void;
  updateText: (id: string, text: string) => void;
}

export const useMapNodeStore = create<NodeState>((set) => ({
  nodes: {
    root: {
      id: "root",
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      text: "Root",
    },
  },
  addNode: (newNode: MapNode) =>
    set((state) => ({ nodes: { ...state.nodes, [newNode.id]: newNode } })),
  updatePosition: (id: string, newX: number, newY: number) =>
    set((state) => ({
      nodes: { ...state.nodes, [id]: { ...state.nodes[id], x: newX, y: newY } },
    })),
  deleteNode: (id: string) =>
    set((state) => {
      const updatedNodes = { ...state.nodes };
      delete updatedNodes[id];
      return { nodes: updatedNodes };
    }),
  updateText: (id: string, newText: string) =>
    set((state) => ({
      nodes: { ...state.nodes, [id]: { ...state.nodes[id], text: newText } },
    })),
}));
