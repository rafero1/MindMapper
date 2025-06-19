import { DbService } from "../../../stores/db";
import {
  DEFAULT_GRAPHNODE_MAP,
  generateNodeId,
  type Graph,
  type GraphNode,
  type GraphNodeMap,
} from "../../../stores/nodeStore/types";
import { useGraphStore } from "../../../stores/nodeStore/nodeStore";
import Item from "./menuItem/item";
import {
  Bars3Icon,
  ChevronDoubleRightIcon,
  PlusIcon,
} from "@heroicons/react/16/solid";
import { useState } from "react";
import { ChevronDoubleLeftIcon } from "@heroicons/react/16/solid";

const SidebarMenu = () => {
  const { graphs, activeGraph, setActiveGraph, addGraph } = useGraphStore(
    (state) => state
  );

  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-row-reverse gap-2 absolute top-30 left-10 bottom-10 z-10 transform ${
        open ? "translate-x-0" : "-translate-x-92"
      } transition-transform duration-250 ease-in-out`}
    >
      <button
        className="h-fit bg-stone-950"
        onClick={toggleMenu}
        title="Open sidebar menu"
      >
        {open ? (
          <ChevronDoubleLeftIcon className="w-5" />
        ) : (
          <ChevronDoubleRightIcon className="w-5" />
        )}
      </button>
      <aside
        className={`w-82 bg-stone-950/75 rounded-md shadow-lg overflow-auto`}
      >
        <div className="h-full p-4 flex flex-col justify-between">
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
            className="flex justify-center items-end hover:text-lime-500"
            onClick={() => {
              const name = prompt(
                "Enter the title of the new mind map:"
              )?.trim();
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
    </div>
  );
};

export default SidebarMenu;
