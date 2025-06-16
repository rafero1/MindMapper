import Dexie, { type EntityTable } from "dexie";
import type { TreeNode } from "./nodeStore/types";

const DB_NAME = "MindMapDB";

export const db = new Dexie(DB_NAME) as Dexie & {
  nodes: EntityTable<TreeNode, "id">;
};

db.version(1).stores({
  nodes: "id, x, y, text, parentId",
});

db.open().catch((err) => {
  console.error(`Failed to open IndexedDB: ${err.stack || err}`);
});

export async function addNodeToDB(node: TreeNode) {
  return db.nodes.put(node); // Use put for upsert (insert or update if ID exists)
}

export async function updateNodeInDB(node: TreeNode) {
  return db.nodes.put(node);
}

export async function deleteNodeFromDB(id: string) {
  return db.nodes.delete(id);
}

export async function getAllNodesFromDB() {
  return db.nodes.toArray();
}
