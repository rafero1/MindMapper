import { useSettingsStore } from "../../../stores/settingsStore/settingsStore";
import classes from "./style.module.css";

const ActionBar = () => {
  const { toggleGrid } = useSettingsStore((state) => state);
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
