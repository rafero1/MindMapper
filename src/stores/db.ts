import Dexie, { type EntityTable } from "dexie";
import { type Graph, type GraphNode, nodeArrayToMap } from "./nodeStore/types";

const DB_NAME = "MindMapDB";
const GraphTable = "id, title, createdAt, lastModified";
const GraphNodeTable = "id, x, y, text, parentId, graphId*";

export const db = new Dexie(DB_NAME) as Dexie & {
  graphs: EntityTable<Graph, "id">;
  nodes: EntityTable<GraphNode, "id">;
};

db.version(1).stores({
  graphs: GraphTable,
  nodes: GraphNodeTable,
});

db.open().catch((err) => {
  console.error(`Failed to open IndexedDB: ${err.stack || err}`);
});

/**
 * Database service for managing graphs and nodes.
 */
export const DbService = {
  Graphs: {
    async get(id: string) {
      return db.graphs.get(id);
    },

    async getLastModified() {
      return db.graphs.orderBy("lastModified").last();
    },

    async getAll() {
      return db.graphs.orderBy("createdAt").toArray();
    },

    async insertOrUpdate(graph: Graph) {
      return db.graphs.put(graph);
    },

    async rename(id: string, newTitle: string) {
      const graph = await db.graphs.get(id);
      if (graph) {
        graph.title = newTitle;
        return db.graphs.put(graph);
      }
      throw new Error("Graph not found");
    },

    async updateLastOpenedDate(id: string) {
      const graph = await db.graphs.get(id);
      if (graph) {
        graph.lastModified = new Date();
        return db.graphs.put(graph);
      }
      throw new Error("Graph not found");
    },

    async delete(id: string) {
      return db.graphs.delete(id);
    },
  },

  Nodes: {
    async getAll(graphId: string) {
      return db.nodes
        .where("graphId")
        .equals(graphId)
        .toArray()
        .then((nodes) => nodeArrayToMap(nodes));
    },

    async insertOrUpdate(node: GraphNode) {
      return db.nodes.put(node);
    },

    async delete(id: string) {
      return db.nodes.delete(id);
    },

    async deleteByGraphId(graphId: string) {
      return db.nodes.where("graphId").equals(graphId).delete();
    },
  },
};
