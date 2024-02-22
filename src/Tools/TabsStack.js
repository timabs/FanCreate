import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../redux/active";
import Stack from "react-bootstrap/esm/Stack";

export default function TabsStack({ windowWidth }) {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.active.activeTab);
  const tabSwitch = (e) => {
    console.log(e.target.dataset.value);
    dispatch(setActiveTab(e.target.dataset.value));
  };
  return (
    <Stack direction="horizontal" gap={0} className="tabs-stack">
      <div
        className={`tabs ${activeTab === "chat" ? "highlighted-tab" : ""}`}
        onClick={(e) => tabSwitch(e)}
        data-value="chat"
      >
        <p className="h4" data-value="chat">
          Chats
        </p>
      </div>
      <div
        className={`tabs ${activeTab === "soc-med" ? "highlighted-tab" : ""}`}
        onClick={tabSwitch}
        data-value="soc-med"
      >
        <p className="h4" data-value="soc-med">
          Social Media
        </p>
      </div>
      <div
        className={`tabs home-lock ${
          activeTab === "screens" ? "highlighted-tab" : ""
        }`}
        onClick={tabSwitch}
        data-value="screens"
      >
        <p className="h5" data-value="screens">
          {windowWidth < 1400 ? "Screens" : "Home/Lock Screens"}
        </p>
      </div>
    </Stack>
  );
}
