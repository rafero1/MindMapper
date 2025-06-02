import { useEffect, useRef } from "react";
import classes from "./style.module.css";

type Props = {
  open: boolean;
  x: number;
  y: number;
  onRename?: () => void;
  onAdd?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
};

const FloatingMenu = ({
  open,
  x,
  y,
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
      <button onClick={onRename}>Rename</button>
      <button onClick={onAdd}>Add</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  ) : null;
};

export default FloatingMenu;
