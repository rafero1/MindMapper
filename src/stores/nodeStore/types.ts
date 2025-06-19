export interface Graph {
  id: string;
  title: string;
  createdAt: Date;
  lastModified: Date;
}

export const DEFAULT_GRAPH = {
  id: "default-graph",
  title: "MindMap 1",
  createdAt: new Date(),
  lastModified: new Date(),
};

/**
 * Represents a node in the graph structure.
 */
export interface GraphNode {
  id: string;
  x: number;
  y: number;
  text: string;
  parentId?: string;
  graphId: string;
}

export function generateNodeId() {
  return `node-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Represents a map of nodes, where the key is the node ID.
 */
export type GraphNodeMap = {
  [id: string]: GraphNode;
};

export function nodeArrayToMap(nodes: GraphNode[]) {
  const nodeMap: GraphNodeMap = {};
  for (const node of nodes) {
    nodeMap[node.id] = node;
  }
  return nodeMap;
}

export const DEFAULT_GRAPHNODE_MAP: GraphNodeMap = {
  root: {
    id: generateNodeId(),
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    text: "Root",
    graphId: DEFAULT_GRAPH.id,
  },
};
