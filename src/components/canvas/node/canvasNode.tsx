import { Circle, Group, Text } from "react-konva";
import type { TreeNode } from "../../../stores/nodeStore/types";
import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Colors } from "../../../theme/colors";
import { setCursor } from "../../../utils/css";
import { useTreeNodeStore } from "../../../stores/nodeStore/nodeStore";

type Props = {
  node: TreeNode;
  onClick: (event: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => void;
};

const CanvasNode = ({ node, onClick }: Props) => {
  const { updateNodePosition } = useTreeNodeStore();

  return (
    <Group
      id={node.id}
      x={node.x}
      y={node.y}
      draggable
      onClick={onClick}
      onDragMove={(event) => {
        const newX = event.target.x();
        const newY = event.target.y();
        updateNodePosition(node.id, newX, newY);
      }}
      onMouseEnter={() => setCursor("pointer")}
      onMouseLeave={() => setCursor("auto")}
      onDragStart={() => setCursor("grabbing")}
      onDragEnd={() => setCursor("pointer")}
    >
      <Circle
        radius={60}
        fill={Colors.NODE_FILL}
        stroke={Colors.NODE_STROKE}
        strokeWidth={3}
      />
      {node.text && (
        <Text
          key={node.id + "-text"}
          text={node.text}
          fontSize={20}
          fill={Colors.NODE_TEXT}
          width={120}
          height={120}
          x={-60}
          y={-60}
          verticalAlign="middle"
          align="center"
        />
      )}
    </Group>
  );
};

export default CanvasNode;
