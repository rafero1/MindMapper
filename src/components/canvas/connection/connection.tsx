import { Line } from "react-konva";
import type { GraphNode } from "../../../stores/nodeStore/types";
import { Theme } from "../../../theme/theme";

type Props = {
  parent: GraphNode;
  node: GraphNode;
};

const NodeConnection = ({ parent, node }: Props) => {
  return (
    <Line
      points={[parent.x, parent.y, node.x, node.y]}
      stroke={Theme.colors.nodeStroke}
      strokeWidth={Theme.nodeStrokeWidth}
    />
  );
};

export default NodeConnection;
