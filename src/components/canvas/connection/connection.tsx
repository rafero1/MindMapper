import { Line } from "react-konva";
import type { MapNode } from "../../../stores/types";
import { Colors } from "../../../theme/colors";

type Props = {
  parent: MapNode;
  node: MapNode;
};

const NodeConnection = ({ parent, node }: Props) => {
  return (
    <Line
      points={[parent.x, parent.y, node.x, node.y]}
      stroke={Colors.nodeStroke}
      strokeWidth={3}
    />
  );
};

export default NodeConnection;
