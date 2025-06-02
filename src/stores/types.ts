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
