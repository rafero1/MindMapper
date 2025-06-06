import type { KonvaEventObject } from "konva/lib/Node";
import type { Stage as StageType } from "konva/lib/Stage";
import { useEffect, useRef, useState } from "react";
import { Stage } from "react-konva";
import { useSettingsStore } from "../../../stores/settingsStore/settingsStore";
import { setCursor } from "../../../utils/css";

const ZOOM_BY = 1.2;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;

type Props = {
  children: React.ReactNode;
  onStageClick?: (event: KonvaEventObject<MouseEvent>) => void;
};

const InteractiveStage = ({ onStageClick, children }: Props) => {
  const stageRef = useRef<StageType | null>(null);
  const [draggingStage, setDraggingStage] = useState(false);
  const [lastPointerPosition, setLastPointerPosition] = useState({
    x: 0,
    y: 0,
  });

  const { setZoomLevel } = useSettingsStore();

  /**
   * Zoom in and out of the canvas using the mouse wheel.
   */
  const handleZoom = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    // scroll up: zoom in, scroll down: zoom out
    let direction = event.evt.deltaY > 0 ? -1 : 1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (event.evt.ctrlKey) {
      direction = -direction;
    }

    const oldScale = stage.scaleX();
    let newScale = direction > 0 ? oldScale * ZOOM_BY : oldScale / ZOOM_BY;

    newScale = Math.max(newScale, MIN_ZOOM);
    newScale = Math.min(newScale, MAX_ZOOM);
    stage.scale({ x: newScale, y: newScale });
    setZoomLevel(newScale);

    // change position based on pointer location

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const handleBeginDragStage = (event: KonvaEventObject<MouseEvent>) => {
    event.evt.preventDefault();
    const stage = stageRef.current;
    if (
      !stage ||
      event.target !== event.target.getStage() ||
      event.evt.button !== 1
    ) {
      return;
    }
    setDraggingStage(true);
    const pointerPos = stage.getPointerPosition();
    setLastPointerPosition({
      x: pointerPos ? pointerPos.x : 0,
      y: pointerPos ? pointerPos.y : 0,
    });
  };

  const handleStopDragStage = (event: KonvaEventObject<MouseEvent>) => {
    event.evt.preventDefault();
    if (
      !draggingStage ||
      event.target !== event.target.getStage() ||
      event.evt.button !== 1
    ) {
      return;
    }
    setDraggingStage(false);
    setLastPointerPosition({ x: 0, y: 0 });
  };

  const handleDragStage = (event: KonvaEventObject<MouseEvent>) => {
    event.evt.preventDefault();
    if (!draggingStage) return;

    const stage = stageRef.current;
    if (!stage || event.target !== event.target.getStage()) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const stagePos = stage.position();
    stage.position({
      x: stagePos.x + pointer.x - lastPointerPosition.x,
      y: stagePos.y + pointer.y - lastPointerPosition.y,
    });
    setLastPointerPosition(pointer);
  };

  useEffect(() => {
    if (draggingStage) {
      setCursor("grabbing");
    } else {
      setCursor("auto");
    }
  }, [draggingStage]);

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onWheel={handleZoom}
      onMouseDown={handleBeginDragStage}
      onMouseMove={handleDragStage}
      onMouseUp={handleStopDragStage}
      onClick={onStageClick}
    >
      {children}
    </Stage>
  );
};

export default InteractiveStage;
