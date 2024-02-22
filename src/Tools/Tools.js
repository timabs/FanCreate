import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ChatTools from "./ChatTools";
import ScreenTools from "./ScreenTools";
import SocMedTools from "./SocMedTools";
import TabsStack from "./TabsStack";
//Tools Component
export default function Tools() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // const dispatch = useDispatch();

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <Row>{/* <TabsStack windowWidth={windowWidth} /> */}</Row>
      <div className="tools-pages">
        <ChatTools />
        {/* <SocMedTools />
        <ScreenTools /> */}
      </div>
    </Col>
  );
}
