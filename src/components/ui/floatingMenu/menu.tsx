import { useEffect, useRef } from "react";
import classes from "./style.module.css";
import type { MapNode } from "../../../stores/types";

type Props = {
  open: boolean;
  x: number;
  y: number;
  targetNode: MapNode | null;
  onRename?: (node: MapNode) => void;
  onAdd?: (node: MapNode) => void;
  onDelete?: (node: MapNode) => void;
  onClose?: () => void;
};

const FloatingMenu = ({
  open,
  x,
  y,
  targetNode,
  onRename,
  onAdd,
  onDelete,
  onClose,
}: Props) => {
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
      <button onClick={() => targetNode && onRename?.(targetNode)}>
        Rename
      </button>
      <button onClick={() => targetNode && onAdd?.(targetNode)}>Add</button>
      <button onClick={() => targetNode && onDelete?.(targetNode)}>
        Delete
      </button>
    </div>
  ) : null;
};

export default FloatingMenu;
