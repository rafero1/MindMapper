import Dexie, { type EntityTable } from "dexie";
import type { NodeMap, TreeNode } from "./nodeStore/types";

const DB_NAME = "MindMapDB";

export const db = new Dexie(DB_NAME) as Dexie & {
  nodes: EntityTable<TreeNode, "id">;
};

const NodeMapTable = "id, x, y, text, parentId";

db.version(1).stores({
  nodes: NodeMapTable,
});

db.open().catch((err) => {
  console.error(`Failed to open IndexedDB: ${err.stack || err}`);
});

export async function insertOrUpdateNodeInDB(node: TreeNode) {
  return db.nodes.put(node);
}

export async function deleteNodeFromDB(id: string) {
  return db.nodes.delete(id);
}

export async function getAllNodesFromDB() {
  return db.nodes.toArray().then((nodes) => {
    const nodeMap: NodeMap = {};
    for (const node of nodes) {
      nodeMap[node.id] = node;
    }
    return nodeMap;
  });
}
