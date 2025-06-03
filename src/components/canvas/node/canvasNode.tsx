import { Circle, Group, Text } from "react-konva";
import type { MapNode } from "../../../stores/types";
import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Colors } from "../../../theme/colors";

type Props = {
  node: MapNode;
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
        fill={Colors.nodeFill}
        stroke={Colors.nodeStroke}
        strokeWidth={3}
      />
      {node.text && (
        <Text
          key={node.id + "-text"}
          text={node.text}
          fontSize={20}
          fill={Colors.nodeText}
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
