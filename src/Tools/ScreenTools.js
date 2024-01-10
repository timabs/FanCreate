import React from "react";
import { useSelector } from "react-redux";

export default function ScreenTools() {
  const activeTab = useSelector((state) => state.active.activeTab);
  return (
    <div
      className={`screen-tools__primary__parent ${
        activeTab === "screens" ? "visible" : "invisible"
      }`}
    >
      <h4 style={{ width: "100%", textAlign: "center" }}>Coming Soon!</h4>
    </div>
  );
}
