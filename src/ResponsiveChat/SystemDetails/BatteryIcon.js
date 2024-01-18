import React from "react";
import "./BatteryIcon.css";
import { useSelector } from "react-redux";
// import { setBatteryLevel } from "../../redux/chattools";

export default function BatteryIcon() {
  // const dispatch = useDispatch();
  const batteryLevel = useSelector((state) => state.chat.batteryLevel);

  return (
    <div className="battery-icon">
      <div className="battery-level" style={{ width: `${batteryLevel}%` }} />
    </div>
  );
}
