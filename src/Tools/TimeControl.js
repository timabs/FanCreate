import React, { useEffect } from "react";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { setTime } from "../redux/chattools";
import { useDispatch } from "react-redux";
import useActiveConvo from "../CustomHooks/activeConvosHooks";

export default function TimeControl() {
  const dispatch = useDispatch();
  const format = "h:mm A";
  const activeConversation = useActiveConvo();
  useEffect(() => {
    if (activeConversation?.sysDetails) {
      dispatch(setTime(activeConversation.sysDetails.time));
    }
  }, [dispatch, activeConversation?.sysDetails, activeConversation]);
  const handleTimeChange = (time) => {
    const formattedTime = time ? dayjs(time).format(format) : "";
    dispatch(setTime(formattedTime));
  };
  return (
    <div className="time-tool-div">
      <div
        className="d-flex gap-2 sys-info-dividers"
        // style={{ justifyContent: "space-between" }}
      >
        <span className="time-tool-label tool-text">Time:</span>
        <TimePicker
          format={format}
          bordered={false}
          onChange={handleTimeChange}
          size="large"
          allowClear={true}
        />
      </div>
    </div>
  );
}
