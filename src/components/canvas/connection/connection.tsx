import { Line } from "react-konva";
import type { TreeNode } from "../../../stores/nodeStore/types";
import { Colors } from "../../../theme/colors";

type Props = {
  parent: TreeNode;
  node: TreeNode;
};

const NodeConnection = ({ parent, node }: Props) => {
  return (
    <Line
      points={[parent.x, parent.y, node.x, node.y]}
      stroke={Colors.NODE_STROKE}
      strokeWidth={3}
    />
  );
};

export default NodeConnection;
