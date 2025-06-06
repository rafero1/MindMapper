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
 * builds and returns a map of parentId: [list of TreeNode children]
 * @param nodes the NodeMap
 */
function mapNodesToChildren(nodes: NodeMap) {
  const childIndex: { [parentId: string]: TreeNode[] } = {};
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
export function getDescendants(nodes: NodeMap, parentId: string) {
  const childIndex = mapNodesToChildren(nodes);
  const descendants: TreeNode[] = [];

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
      return { nodes: updatedNodes };
    }),
  updateNodeText: (id: string, newText: string) =>
    set((state) => ({
      nodes: { ...state.nodes, [id]: { ...state.nodes[id], text: newText } },
    })),
}));
