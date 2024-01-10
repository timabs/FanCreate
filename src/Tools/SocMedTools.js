import React from "react";
import { useSelector } from "react-redux";

export default function SocMedTools() {
  const activeTab = useSelector((state) => state.active.activeTab);
  return (
    <div
      className={`soc-med-tools__primary__parent ${
        activeTab === "soc-med" ? "visible" : "invisible"
      }`}
    >
      <h4 style={{ width: "100%", textAlign: "center" }}>Coming Soon!</h4>
    </div>
  );
}
