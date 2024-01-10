import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ChatTools.css";
import "./CellSignalControl.css";
import { setCellSignal } from "../redux/chattools";
import useActiveConvo from "../CustomHooks/activeConvosHooks";

export default function CellSignalControl() {
  const dispatch = useDispatch();
  const cellSignal = useSelector((state) => state.chat.cellSignal);
  const handleCellSignal = (e) => {
    const key = e.currentTarget.dataset.key;
    dispatch(setCellSignal(key));
  };
  const activeConversation = useActiveConvo();
  useEffect(() => {
    if (activeConversation?.sysDetails) {
      dispatch(setCellSignal(activeConversation.sysDetails.cellSignal));
    }
  }, [dispatch, activeConversation?.sysDetails, activeConversation]);
  return (
    <div className="d-flex gap-2 sys-info-dividers">
      <div className="tool-text cell-reception-tool mb-2">Cell Signal:</div>
      <div className="cell-bars-div mb-3">
        <div
          className={`signal-bar cell-1 ${
            1 <= cellSignal ? "full-opacity" : ""
          }`}
          role="button"
          data-key={1}
          onClick={(e) => handleCellSignal(e)}
        ></div>
        <div
          className={`signal-bar cell-2 ${
            2 <= cellSignal ? "full-opacity" : ""
          }`}
          role="button"
          data-key={2}
          onClick={(e) => handleCellSignal(e)}
        ></div>
        <div
          className={`signal-bar cell-3 ${
            3 <= cellSignal ? "full-opacity" : ""
          }`}
          role="button"
          data-key={3}
          onClick={(e) => handleCellSignal(e)}
        ></div>
        <div
          className={`signal-bar cell-4 ${
            4 <= cellSignal ? "full-opacity" : ""
          }`}
          role="button"
          data-key={4}
          onClick={(e) => handleCellSignal(e)}
        ></div>
        <div
          className={`signal-bar cell-5 ${
            5 <= cellSignal ? "full-opacity" : ""
          }`}
          role="button"
          data-key={5}
          onClick={(e) => handleCellSignal(e)}
        ></div>
      </div>
    </div>
  );
}
