import type { Layer as LayerType } from "konva/lib/Layer";
import { useCallback, useEffect, useRef, useState } from "react";
import { Layer, Line } from "react-konva";
import { Theme } from "../../../theme/theme";

type Props = {
  gridSize: number;
  stageWidth: number;
  stageHeight: number;
  stageScale: number;
  stageX: number;
  stageY: number;
};

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface GridLines {
  v: Line[];
  h: Line[];
}

const Grid = ({
  gridSize,
  stageWidth,
  stageHeight,
  stageScale,
  stageX,
  stageY,
}: Props) => {
  const layerRef = useRef<LayerType>(null);

  const [lines, setLines] = useState<GridLines>({
    v: [],
    h: [],
  });

  const calculateGridLines = useCallback(() => {
    const scale = stageScale;
    const offsetX = stageX;
    const offsetY = stageY;

    // Calculate visible area in stage coordinates
    const visibleStartX = -offsetX / scale;
    const visibleStartY = -offsetY / scale;
    const visibleEndX = visibleStartX + stageWidth / scale;
    const visibleEndY = visibleStartY + stageHeight / scale;

    // Calculate start and end grid line indices based on visible area
    const startGridX = Math.floor(visibleStartX / gridSize);
    const endGridX = Math.ceil(visibleEndX / gridSize);
    const startGridY = Math.floor(visibleStartY / gridSize);
    const endGridY = Math.ceil(visibleEndY / gridSize);

    const vLines: Line[] = [];
    for (let i = startGridX; i <= endGridX; i++) {
      const x = i * gridSize;
      vLines.push({
        x1: x,
        y1: visibleStartY,
        x2: x,
        y2: visibleEndY,
      });
    }

    const hLines: Line[] = [];
    for (let i = startGridY; i <= endGridY; i++) {
      const y = i * gridSize;
      hLines.push({
        x1: visibleStartX,
        y1: y,
        x2: visibleEndX,
        y2: y,
      });
    }

    setLines({ v: vLines, h: hLines });
  }, [stageScale, stageX, stageY, stageWidth, stageHeight, gridSize]);

  useEffect(() => {
    calculateGridLines();
  }, [calculateGridLines]);

  return (
    <Layer listening={false} ref={layerRef}>
      {lines.v.map((line, i) => (
        <Line
          key={`grid-v-${i}`}
          points={[line.x1, line.y1, line.x2, line.y2]}
          stroke={Theme.colors.gridLine}
          strokeWidth={1}
          listening={false}
        />
      ))}
      {lines.h.map((line, i) => (
        <Line
          key={`grid-h-${i}`}
          points={[line.x1, line.y1, line.x2, line.y2]}
          stroke={Theme.colors.gridLine}
          strokeWidth={1}
          listening={false}
        />
      ))}
    </Layer>
  );
};

export default Grid;
