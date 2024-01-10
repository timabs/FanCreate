import React, { useEffect, useState } from "react";
import { setActiveTab } from "../redux/active";
import { useDispatch, useSelector } from "react-redux";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Col from "react-bootstrap/Col";
import ChatTools from "./ChatTools";
import ScreenTools from "./ScreenTools";
import SocMedTools from "./SocMedTools";
//Tools Component
export default function Tools() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.active.activeTab);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const tabSwitch = (e) => {
    console.log(e.target.dataset.value);
    dispatch(setActiveTab(e.target.dataset.value));
  };
  return (
    <Col
      md={5}
      sm={12}
      lg={6}
      style={{ height: "80vh" }}
      className="tools-col p-3"
    >
      <Row>
        <h2 className="text-center text-dark p-0 tools-title">Tools</h2>
      </Row>
      <Row>
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
            className={`tabs ${
              activeTab === "soc-med" ? "highlighted-tab" : ""
            }`}
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
      </Row>
      <div className="tools-pages">
        <ChatTools />
        <SocMedTools />
        <ScreenTools />
      </div>
    </Col>
  );
}
