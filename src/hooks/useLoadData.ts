import { useEffect, useState } from "react";
import { DbService } from "../stores/db";
import { type Graph, type GraphNodeMap } from "../stores/nodeStore/types";

const INITIALIZATION_DELAY = 1000;

export function useLoadData() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    graphs?: Graph[];
    activeGraph?: Graph;
    nodes?: GraphNodeMap;
  }>({});

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const fetchData = async () => {
      const graphs = await DbService.Graphs.getAll();
      const activeGraph = await DbService.Graphs.getLastModified();
      let nodes: GraphNodeMap = {};
      if (activeGraph) {
        nodes = await DbService.Nodes.getAll(activeGraph.id);
      }

      setData({
        graphs: graphs,
        activeGraph: activeGraph,
        nodes: nodes,
      });

      // Delay to make loading less abrupt
      setTimeout(() => {
        setIsLoading(false);
      }, INITIALIZATION_DELAY);
    };

    fetchData();
  }, [isLoading]);

  return {
    isLoading,
    data,
  };
}
