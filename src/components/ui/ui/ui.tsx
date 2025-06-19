import InfoPanel from "../infoPanel/infoPanel";
import ActionBar from "../actionBar/actionBar";
import { useSettingsStore } from "../../../stores/settingsStore/settingsStore";
import { useGraphStore } from "../../../stores/nodeStore/nodeStore";
import SidebarMenu from "../sidebarMenu/menu";
import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/16/solid";

const UI = () => {
  const { activeGraph: graph, nodes } = useGraphStore((state) => state);
  const { settings } = useSettingsStore();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      <div className="absolute top-10 left-10 z-20 flex gap-6">
        <button onClick={toggleMenu}>
          <Bars3Icon className="w-5" title="Open sidebar menu" />
        </button>
        <h1 className="text-4xl">{graph.title}</h1>
      </div>

      <SidebarMenu open={menuOpen} />

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
