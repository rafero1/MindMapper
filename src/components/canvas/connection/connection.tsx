import { Line } from "react-konva";
import type { TreeNode } from "../../../stores/nodeStore/types";
import { Colors, Theme } from "../../../theme/theme";

type Props = {
  parent: TreeNode;
  node: TreeNode;
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
