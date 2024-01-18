import React, { useEffect } from "react";
import { Slider } from "antd";
import { setBatteryLevel } from "../redux/chattools";
import { useDispatch } from "react-redux";
import "../ResponsiveChat/SystemDetails/SystemDetails.css";
import "./ChatTools.css";
import useActiveConvo from "../CustomHooks/activeConvosHooks";

export default function BatteryControl() {
  const dispatch = useDispatch();
  const activeConversation = useActiveConvo();

  useEffect(() => {
    if (activeConversation?.sysDetails) {
      dispatch(setBatteryLevel(activeConversation.sysDetails.batteryLevel));
    }
  }, [dispatch, activeConversation?.sysDetails, activeConversation]);
  return (
    <div
      className="d-flex gap-2 sys-info-dividers"
      style={{ flexDirection: "row" }}
    >
      <span className="battery-level-tool-text tool-text">Battery Level:</span>
      <Slider
        min={0}
        max={100}
        defaultValue={50}
        onChange={(value) => dispatch(setBatteryLevel(value))}
      />
    </div>
  );
}
