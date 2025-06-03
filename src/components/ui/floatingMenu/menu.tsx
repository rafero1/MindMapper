import { useRef } from "react";
import classes from "./style.module.css";
import { generateNodeId, type MapNode } from "../../../stores/types";
import { useMapNodeStore } from "../../../stores/nodeStore";

type Props = {
  open: boolean;
  x: number;
  y: number;
  selectedNode: MapNode | null;
  onClose: () => void;
};

const FloatingMenu = ({ open, x, y, selectedNode, onClose }: Props) => {
  const { addNode, updateText } = useMapNodeStore((state) => state);

  const containerRef = useRef<HTMLDivElement | null>(null);

  return open ? (
    <div
      className={classes.menu}
      style={{ left: x, top: y }}
      ref={containerRef}
    >
      <div className={classes.closeContainer}>
        <button className={classes.close} onClick={onClose}>
          X
        </button>
      </div>
      <button
        onClick={() => {
          if (!selectedNode) {
            return;
          }
          const newText = prompt("Enter new text:", selectedNode.text);
          if (!newText || newText.trim() === "") {
            return;
          }
          updateText(selectedNode.id, newText);
          onClose();
        }}
      >
        Rename
      </button>
      <button
        onClick={() => {
          onClose();
          if (!selectedNode) {
            return;
          }
          const newNode = {
            id: generateNodeId(),
            x: selectedNode.x + 200,
            y: selectedNode.y,
            text: `Node`,
            parentId: selectedNode.id,
          };
          addNode(newNode);
        }}
      >
        Add
      </button>
      <button onClick={() => console.log("Delete clicked")}>Delete</button>
    </div>
  ) : null;
};

export default FloatingMenu;
