import React, { useState } from "react";
import "./SystemDetails.css";
import "../../css/index.css";
import BatteryIcon from "./BatteryIcon";
import { useSelector } from "react-redux";

export default function SystemDetailsBar() {
  const activeConversation = useSelector(
    (state) => state.messages.activeConversation
  );
  const batteryLevel = useSelector((state) => state.chat.batteryLevel);
  const time = useSelector((state) => state.chat.time);
  const wifi = useSelector((state) => state.chat.wifi);
  const cellSignal = useSelector((state) => state.chat.cellSignal);
  return (
    <div className="sys-details-bar">
      <span className="time-icon">{time}</span>
      <div className="sys-details-right">
        <div className="phone-internet-section">
          <span className="internet-icon">
            <img src={`./wifi-${wifi}.png`} className="wifi-bars-img"></img>
          </span>
          <span className="signal">
            <img
              src={`./cell-service-${cellSignal}.png`}
              className="cell-bars-img"
            ></img>
          </span>
        </div>
        <div className="battery-section">
          <span className="battery-percentage">{batteryLevel}%</span>
          <BatteryIcon />
        </div>
      </div>
    </div>
  );
}
