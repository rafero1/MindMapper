import type { Layer as LayerType } from "konva/lib/Layer";
import { useRef } from "react";
import { Layer, Line } from "react-konva";
import { Theme } from "../../../theme/theme";

type Props = {
  gridSize: number;
  stageWidth: number;
  stageHeight: number;
};

const Grid = ({ gridSize, stageWidth, stageHeight }: Props) => {
  const layerRef = useRef<LayerType>(null);

  const lineNumberX = Math.ceil(stageWidth / gridSize);
  const lineNumberY = Math.ceil(stageHeight / gridSize);

  return (
    <Layer listening={false} ref={layerRef}>
      {Array.from({ length: lineNumberX }).map((_, i) => (
        <Line
          key={`grid-x-${i}`}
          points={[i * gridSize, 0, i * gridSize, stageHeight]}
          stroke={Theme.colors.gridLine}
          strokeWidth={1}
          listening={false}
        />
      ))}
      {Array.from({ length: lineNumberY }).map((_, i) => (
        <Line
          key={`grid-y-${i}`}
          points={[0, i * gridSize, stageWidth, i * gridSize]}
          stroke={Theme.colors.gridLine}
          strokeWidth={1}
          listening={false}
        />
      ))}
    </Layer>
  );
};

export default Grid;
