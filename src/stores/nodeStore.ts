import { create } from "zustand";
import type { TreeNode } from "./types";

/**
 * Map of TreeNodes
 */
export type NodeMap = {
  [id: string]: TreeNode;
};

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

interface NodeState {
  nodes: NodeMap;
  addNode: (newNode: TreeNode) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  deleteNode: (id: string, deleteMode?: DeleteMode) => void;
  updateNodeText: (id: string, text: string) => void;
}

/**
 * returns the direct children of a node
 * @param nodes the NodeMap
 * @param id the id of the parent
 * @returns array of TreeNodes
 */
export function getChildren(nodes: NodeMap, id: string) {
  return Object.values(nodes).filter((node) => node.parentId === id);
}

/**
 * returns all of the descendants of a node
 * @param nodes the NodeMap
 * @param parentId the id of the parent
 * @returns array of descendants
 */
export function getDescendants(nodes: NodeMap, parentId: string) {
  const descendants: TreeNode[] = [];
  const collectChildren = (id: string) => {
    const children = getChildren(nodes, id);
    if (children.length === 0) {
      return;
    }
    for (const child of children) {
      descendants.push(child);
      collectChildren(child.id);
    }
  };
  collectChildren(parentId);
  return descendants;
}

export const useTreeNodeStore = create<NodeState>((set) => ({
  nodes: {
    root: {
      id: "root",
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      text: "Root",
    },
  },
  addNode: (newNode: TreeNode) =>
    set((state) => ({ nodes: { ...state.nodes, [newNode.id]: newNode } })),
  updateNodePosition: (id: string, newX: number, newY: number) =>
    set((state) => ({
      nodes: { ...state.nodes, [id]: { ...state.nodes[id], x: newX, y: newY } },
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
          const children = getChildren(updatedNodes, id);
          for (const child of children) {
            updatedNodes[child.id].parentId = parentId;
          }
          break;
        }
        case "cascade": {
          const descendants = getDescendants(updatedNodes, id);
          for (const child of descendants) {
            delete updatedNodes[child.id];
          }
          delete updatedNodes[id];
          break;
        }
        default:
          break;
      }
      return { nodes: updatedNodes };
    }),
  updateNodeText: (id: string, newText: string) =>
    set((state) => ({
      nodes: { ...state.nodes, [id]: { ...state.nodes[id], text: newText } },
    })),
}));
