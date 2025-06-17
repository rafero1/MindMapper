import classes from "./style.module.css";
import InfoPanel from "../infoPanel/infoPanel";
import ActionBar from "../actionBar/actionBar";
import { useSettingsStore } from "../../../stores/settingsStore/settingsStore";
import { useTreeNodeStore } from "../../../stores/nodeStore/nodeStore";

const UI = () => {
  const { nodes } = useTreeNodeStore((state) => state);
  const { settings } = useSettingsStore();

  return (
    <>
      <div className={classes.topMenuContainer}>
        <button>Menu</button>
        <h1>MindMap Title</h1>
      </div>

      <ActionBar />

      <InfoPanel
        data={[
          { label: "Node Count", value: Object.keys(nodes).length },
          {
            label: "Zoom Level",
            value: settings.zoomLevel.toPrecision(2) + "x",
          },
        ]}
      />
    </>
  );
};

export default UI;
