import React, { useContext } from "react";
import "./SystemDetails.css";
import "../../css/index.css";
import BatteryIcon from "./BatteryIcon";
import { useSelector } from "react-redux";
import { ChatContext } from "../ChatContext";

export default function SystemDetailsBar() {
  // const activeConversation = useSelector(
  //   (state) => state.messages.activeConversation
  // );
  const batteryLevel = useSelector((state) => state.chat.batteryLevel);
  const time = useSelector((state) => state.chat.time);
  const wifi = useSelector((state) => state.chat.wifi);
  const cellSignal = useSelector((state) => state.chat.cellSignal);
  const { chatRef } = useContext(ChatContext);

  const toggleFullscreen = () => {
    const chat = chatRef.current;
    if (!document.fullscreenElement) {
      if (chat.requestFullscreen) {
        chat.requestFullscreen();
      } else if (chat.mozRequestFullScreen) {
        /* Firefox */
        chat.mozRequestFullScreen();
      } else if (chat.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        chat.webkitRequestFullscreen();
      } else if (chat.msRequestFullscreen) {
        /* IE/Edge */
        chat.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    }
  };

  return (
    <div className="sys-details-bar">
      <span className="time-icon">{time}</span>
      <div className="sys-details-right">
        <div className="phone-internet-section">
          <span className="internet-icon">
            <img
              src={`./wifi-${wifi}.png`}
              className="wifi-bars-img"
              alt="Wifi bars"
            ></img>
          </span>
          <span className="signal">
            <img
              src={`./cell-service-${cellSignal}.png`}
              className="cell-bars-img"
              alt="Cell phone signal bars"
            ></img>
          </span>
        </div>
        <div className="battery-section">
          <span className="battery-percentage">{batteryLevel}%</span>
          <BatteryIcon />
        </div>
        <img
          src="./fullscreen.png"
          aria-hidden="true"
          className="fa-solid fa-expand"
          style={{ color: "#b5b7ba" }}
          onClick={() => toggleFullscreen()}
          role="button"
          alt="toggle fullscreen button"
        ></img>
      </div>
    </div>
  );
}
