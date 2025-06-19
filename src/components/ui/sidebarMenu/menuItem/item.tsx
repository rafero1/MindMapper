import type { Graph, GraphNodeMap } from "../../../../stores/nodeStore/types";
import { DbService } from "../../../../stores/db";
import { useGraphStore } from "../../../../stores/nodeStore/nodeStore";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";

type Props = {
  item: Graph;
  active?: boolean;
};

async function fetchGraphWithNodes(id: string) {
  const graph = await DbService.Graphs.get(id);
  let nodes: GraphNodeMap = {};
  if (graph) {
    nodes = await DbService.Nodes.getAll(graph.id);
  } else {
    throw new Error("Graph not found");
  }
  return { graph, nodes };
}

const Item = ({ item, active }: Props) => {
  const {
    setActiveGraph,
    deleteGraph,
    renameGraph,
    updateLastOpenedDateGraph,
  } = useGraphStore((state) => state);

  return (
    <li className="flex gap-2 justify-between">
      <button
        className="flex-1 text-left disabled:opacity-50"
        onClick={() => {
          fetchGraphWithNodes(item.id).then(({ graph, nodes }) => {
            setActiveGraph(graph, nodes);
            updateLastOpenedDateGraph(item.id);
            DbService.Graphs.updateLastOpenedDate(item.id);
          });
        }}
        disabled={active}
      >
        {item.title}
      </button>
      <button
        className="p-2 text-white hover:text-indigo-500"
        onClick={() => {
          const newName = prompt(
            "Enter new mind map title:",
            item.title
          )?.trim();
          if (newName && newName !== item.title) {
            renameGraph(item.id, newName);
            DbService.Graphs.rename(item.id, newName);
          }
        }}
        title="Rename"
      >
        <PencilSquareIcon className="w-4 transition-colors duration-250" />
      </button>
      <button
        className="text-white hover:text-red-500"
        title="Delete"
        onClick={() => {
          if (active) {
            // TODO: handle this
            // if active, after deletion either open the last modified graph or create a new one
            alert("Cannot delete the currently active mind map.");
            return;
          }
          const confirm = window.confirm(
            "Are you sure you want to delete this mind map?"
          );
          if (confirm) {
            deleteGraph(item.id);
            DbService.Graphs.delete(item.id);
            DbService.Nodes.deleteByGraphId(item.id);
          }
        }}
      >
        <TrashIcon className="w-4 transition-colors duration-250" />
      </button>
    </li>
  );
};

export default Item;
