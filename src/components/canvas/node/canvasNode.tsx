import { Circle, Group, Text } from "react-konva";
import type { TreeNode } from "../../../stores/nodeStore/types";
import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Theme } from "../../../theme/theme";
import { setCursor } from "../../../utils/css";
import { useTreeNodeStore } from "../../../stores/nodeStore/nodeStore";
import { useRef, useState } from "react";
import { insertOrUpdateNodeInDB } from "../../../stores/db";

type Props = {
  node: TreeNode;
  onClick: (event: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => void;
};

const CanvasNode = ({ node, onClick }: Props) => {
  const { updateNodePosition } = useTreeNodeStore();

  const [size] = useState(Theme.nodeSize);
  const textOffset = useRef(10);

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
      onDragEnd={() => {
        setCursor("pointer");
        insertOrUpdateNodeInDB(node).catch((err) => {
          console.error("Failed to update node in DB:", err);
        });
      }}
    >
      <Circle
        radius={size}
        fill={Theme.colors.nodeFill}
        stroke={Theme.colors.nodeStroke}
        strokeWidth={Theme.nodeStrokeWidth}
      />
      {node.text && (
        <Text
          key={node.id + "-text"}
          text={node.text}
          fontSize={Theme.font.size}
          fontFamily={Theme.font.family}
          fill={Theme.colors.nodeText}
          width={(size - textOffset.current) * 2}
          height={(size - textOffset.current) * 2}
          x={-size + textOffset.current}
          y={-size + textOffset.current}
          verticalAlign="middle"
          align="center"
        />
      )}
    </Group>
  );
};

export default CanvasNode;
