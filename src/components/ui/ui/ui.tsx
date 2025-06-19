import InfoPanel from "../infoPanel/infoPanel";
import ActionBar from "../actionBar/actionBar";
import { useSettingsStore } from "../../../stores/settingsStore/settingsStore";
import { useGraphStore } from "../../../stores/nodeStore/nodeStore";
import SidebarMenu from "../sidebarMenu/menu";

const UI = () => {
  const { activeGraph: graph, nodes } = useGraphStore((state) => state);
  const { settings } = useSettingsStore();

  return (
    <>
      <div className="absolute top-10 left-10 z-20 flex gap-6">
        <h1 className="text-4xl">{graph?.title}</h1>
      </div>
      <SidebarMenu />
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
