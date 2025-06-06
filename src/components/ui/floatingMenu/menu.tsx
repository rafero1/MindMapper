import { forwardRef } from "react";
import classes from "./style.module.css";
import { generateNodeId, type TreeNode } from "../../../stores/nodeStore/types";
import { useTreeNodeStore } from "../../../stores/nodeStore/nodeStore";

type Props = {
  open: boolean;
  x: number;
  y: number;
  selectedNode: TreeNode | null;
  onClose: () => void;
};

const FloatingMenu = forwardRef<HTMLDivElement, Props>(
  ({ open, x, y, selectedNode, onClose }, ref) => {
    const { addNode, updateNodeText, deleteNode } = useTreeNodeStore(
      (state) => state
    );

    return open ? (
      <div className={classes.menu} style={{ left: x, top: y }} ref={ref}>
        <div className={classes.closeContainer}>
          <button className={classes.close} onClick={onClose}>
            X
          </button>
        </div>
        <button
          onClick={() => {
            onClose();
            if (!selectedNode) {
              return;
            }
            const newText = prompt("Enter new text:", selectedNode.text);
            if (!newText || newText.trim() === "") {
              return;
            }
            updateNodeText(selectedNode.id, newText);
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
        <button
          onClick={() => {
            onClose();
            if (!selectedNode) {
              return;
            }
            deleteNode(selectedNode.id);
          }}
        >
          Delete
        </button>
      </div>
    ) : (
      <></>
    );
  }
);

export default FloatingMenu;
