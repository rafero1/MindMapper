import { DbService } from "../../../stores/db";
import { useEffect, useState } from "react";
import {
  DEFAULT_GRAPHNODE_MAP,
  generateNodeId,
  type Graph,
  type GraphNode,
  type GraphNodeMap,
} from "../../../stores/nodeStore/types";
import { useGraphStore } from "../../../stores/nodeStore/nodeStore";
import Item from "./menuItem/item";
import { PlusIcon } from "@heroicons/react/16/solid";

type Props = {
  open: boolean;
};

const SidebarMenu = ({ open }: Props) => {
  const { graphs, activeGraph, setActiveGraph, addGraph } = useGraphStore(
    (state) => state
  );

  return (
    <aside className="absolute top-30 left-10 bottom-10 z-10 w-72 bg-stone-950/75 rounded-md shadow-lg transition-transform duration-300">
      <div className="p-4 flex flex-col justify-between">
        <nav>
          <ol className="list-none p-0 flex flex-col gap-3">
            {graphs.map((doc) => (
              <Item
                item={doc}
                active={activeGraph?.id === doc.id}
                key={doc.id}
              />
            ))}
          </ol>
        </nav>
        <button
          className="absolute bottom-0 left-0 right-0 m-4 flex justify-center items-end hover:text-lime-500"
          onClick={() => {
            const name = prompt("Enter the title of the new mind map:")?.trim();
            if (name) {
              const newGraph: Graph = {
                id: crypto.randomUUID(),
                title: name,
                createdAt: new Date(),
                lastModified: new Date(),
              };
              const rootNode: GraphNode = {
                ...DEFAULT_GRAPHNODE_MAP.root,
                id: generateNodeId(),
                graphId: newGraph.id,
              };
              const newNodeMap: GraphNodeMap = {
                [rootNode.id]: rootNode,
              };
              DbService.Graphs.insertOrUpdate(newGraph).catch((error) => {
                console.error("Failed to insert or update graph:", error);
              });
              DbService.Nodes.insertOrUpdate(rootNode).catch((error) => {
                console.error("Failed to insert or update root node:", error);
              });
              addGraph(newGraph);
              setActiveGraph(newGraph, newNodeMap);
            }
          }}
        >
          <PlusIcon className="w-6 mr-2 transition-colors duration-250" />
          <span className="text-white">New MindMap</span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarMenu;
