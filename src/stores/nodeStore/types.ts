/**
 * TreeNode represents a node in the mind map tree
 */
export interface TreeNode {
  id: string;
  x: number;
  y: number;
  text: string;
  parentId?: string;
}

export function generateNodeId() {
  return `node-${Math.random().toString(36).slice(2, 9)}`;
}
