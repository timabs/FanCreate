import React, { useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useDispatch } from "react-redux";
import { setWifi } from "../redux/chattools";
import useActiveConvo from "../CustomHooks/activeConvosHooks";

export default function WifiLevels() {
  const dispatch = useDispatch();
  const activeConversation = useActiveConvo();
  useEffect(() => {
    if (activeConversation?.sysDetails) {
      dispatch(setWifi(activeConversation.sysDetails.wifi));
    }
  }, [dispatch, activeConversation?.sysDetails, activeConversation]);
  const handleWifi = (e) => {
    dispatch(setWifi(e.key));
  };
  const items = [
    {
      label: <span value="wifi-1">1 Bar</span>,
      key: 1,
    },
    {
      type: "divider",
    },
    {
      label: <span value="wifi-2">2 Bars</span>,
      key: 2,
    },
    {
      type: "divider",
    },
    {
      label: <span value="wifi-3">3 Bars</span>,
      key: 3,
    },
    {
      type: "divider",
    },
    {
      label: <span value="wifi-4">4 Bars</span>,
      key: 4,
    },
  ];
  return (
    <div
      className="d-flex gap-2 sys-info-dividers"
      style={{ alignSelf: "flex-start" }}
    >
      <div className="wifi-levels tool-text mb-2">
        <Dropdown
          menu={{ items, onClick: (e) => handleWifi(e) }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Wifi Levels
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
}
