import { forwardRef } from "react";
import {
  generateNodeId,
  type GraphNode,
} from "../../../stores/nodeStore/types";
import { useGraphStore } from "../../../stores/nodeStore/nodeStore";
import { DbService } from "../../../stores/db";

type Props = {
  open: boolean;
  x: number;
  y: number;
  selectedNode: GraphNode | null;
  onClose: () => void;
};

const FloatingMenu = forwardRef<HTMLDivElement, Props>(
  ({ open, x, y, selectedNode, onClose }, ref) => {
    const { addNode, updateNodeText, deleteNode } = useGraphStore(
      (state) => state
    );

    return open ? (
      <div
        className="absolute z-20 bg-stone-950/75 p-2 flex flex-col gap-2 rounded-md shadow-lg"
        style={{ left: x, top: y }}
        ref={ref}
      >
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
            selectedNode.text = newText;
            DbService.Nodes.insertOrUpdate(selectedNode).catch((err) => {
              console.error("Failed to update node in DB:", err);
            });
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
              graphId: selectedNode.graphId,
            };
            addNode(newNode);
            DbService.Nodes.insertOrUpdate(newNode).catch((err) => {
              console.error("Failed to add node to DB:", err);
            });
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
            DbService.Nodes.delete(selectedNode.id).catch((err) => {
              console.error("Failed to delete node from DB:", err);
            });
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
