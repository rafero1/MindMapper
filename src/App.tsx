import { useEffect, useState } from "react";
import "./App.css";
import { Circle, Layer, Stage } from "react-konva";
import FloatingMenu from "./components/ui/floatingMenu/menu";

function App() {
  const [count, setCount] = useState(0);
  const [menuX, setMenuX] = useState(0);
  const [menuY, setMenuY] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <>
      <Stage width={window.innerWidth} height={window.innerHeight - 200}>
        <Layer>
          <Circle
            x={window.innerWidth / 2}
            y={window.innerHeight / 2}
            radius={50}
            fill="red"
            stroke="black"
            strokeWidth={4}
            draggable
            onClick={() => {
              setMenuX(window.innerWidth / 2 + 60);
              setMenuY(window.innerHeight / 2);
              setIsMenuVisible(true);
            }}
          />
        </Layer>
      </Stage>
      <FloatingMenu
        open={isMenuVisible}
        x={menuX}
        y={menuY}
        onRename={() => console.log("Rename clicked")}
        onAdd={() => console.log("Add clicked")}
        onDelete={() => console.log("Delete clicked")}
        onClose={() => setIsMenuVisible(false)}
      />
      <div>
        <h1>UI Panel</h1>
        <button>Button example</button>
      </div>
    </>
  );
}

export default App;
