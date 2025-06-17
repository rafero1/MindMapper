import { useEffect, useRef, useState } from "react";
import { useSettingsStore } from "../../../stores/settingsStore/settingsStore";
import { getBoolean, setBoolean } from "../../../utils/localStorage";
import classes from "./style.module.css";

const ActionBar = () => {
  const { settings, setGridEnabled, toggleGrid } = useSettingsStore(
    (state) => state
  );

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      const gridEnabled = getBoolean("gridEnabled");
      if (gridEnabled !== null) {
        setGridEnabled(gridEnabled);
      }
      setLoaded(true);
    }
  }, [loaded, setGridEnabled]);

  useEffect(() => {
    if (loaded) {
      setBoolean("gridEnabled", settings.gridEnabled);
    }
  }, [loaded, settings.gridEnabled]);

  return (
    <div className={classes.menu}>
      <button
        className={classes.menuItem}
        onClick={() => {
          toggleGrid();
        }}
      >
        Toggle Grid
      </button>
    </div>
  );
};

export default ActionBar;
