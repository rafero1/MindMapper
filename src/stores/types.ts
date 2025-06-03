/**
 * MapNode represents a node in the graph
 */
export interface MapNode {
  id: string;
  x: number;
  y: number;
  text: string;
  parentId?: string;
}

export function generateNodeId(): string {
  return `node-${Math.random().toString(36).slice(2, 9)}`;
}
