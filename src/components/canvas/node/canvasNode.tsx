import { Circle, Group, Text } from "react-konva";
import type { TreeNode } from "../../../stores/nodeStore/types";
import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Colors } from "../../../theme/colors";

type Props = {
  node: TreeNode;
  onClick: (event: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => void;
  onDragMove: (event: KonvaEventObject<DragEvent, Node<NodeConfig>>) => void;
};

const CanvasNode = ({ node, onClick, onDragMove }: Props) => {
  return (
    <Group
      id={node.id}
      x={node.x}
      y={node.y}
      draggable
      onClick={onClick}
      onDragMove={onDragMove}
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
