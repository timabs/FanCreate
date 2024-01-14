import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./ChatTools.css";
import {
  setYouBubbleColor,
  setBackgroundImg,
  setOpacity,
  setBatteryLevel,
  setTime,
  updateSysDetails,
  updateBackgroundImg,
} from "../redux/chattools";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { Slider } from "antd";

import ImageUploader from "../ImageHandling/ImageUploader";
import {
  deleteImgFromCloud,
  getCloudinaryImgId,
  uploadImgToCloud,
} from "../utils/cloudinary";
import WifiLevels from "./WifiLevelControl";
import TimeControl from "./TimeControl";
import BatteryControl from "./BatteryControl";
import CellSignalControl from "./CellSignalControl";
import useActiveConvo from "../CustomHooks/activeConvosHooks";
import CustomSpinner from "../utils/Spinner";

function OpacitySlider() {
  const dispatch = useDispatch();

  const opacity = useSelector((state) => state.chat.opacity);
  const handleOpacity = (e) => {
    dispatch(setOpacity(e.target.value));
  };
  const [opacityToggled, setOpacityToggled] = useState(false);
  const opacityDivRef = useRef();
  const bodySec = document.querySelector(".bodysec");

  const handleBodyClick = (e) => {
    if (!opacityDivRef.current.contains(e.target)) {
      setOpacityToggled(false);
      // Remove the event listener to avoid stacking
      bodySec?.removeEventListener("click", handleBodyClick);
    }
  };
  const toggleOpacitySlider = () => {
    setOpacityToggled(!opacityToggled);
    if (!opacityToggled) {
      bodySec?.addEventListener("click", handleBodyClick);
    } else {
      bodySec?.removeEventListener("click", handleBodyClick);
    }
  };

  return (
    <div id="opacity-div" ref={opacityDivRef} className="bg-img-tools">
      <img
        src="./opacity-icon.png"
        alt="Change opacity button"
        role="button"
        className="img-tool-button"
        onClick={toggleOpacitySlider}
        style={{
          border: "1px solid #d14ea5",
        }}
      ></img>
      <label htmlFor="opacity-slider">
        <input
          title="Opacity Slider"
          id="opacity-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={(e) => handleOpacity(e)}
          className={`${opacityToggled ? "opacity-1" : "opacity-0"}`}
          style={{
            position: "absolute",
            top: "140%",
            left: "0%",
            transition: "all 150ms ease-in-out",
          }}
        />
      </label>
    </div>
  );
}
function DeleteBackgroundImg({ setBgBlob }) {
  const dispatch = useDispatch();
  const activeConversation = useActiveConvo();
  const imgToDelURL = useSelector((state) => state.chat.backgroundImg);
  const removeBackgroundImg = async () => {
    const conversationId = activeConversation?._id;
    const imageId = getCloudinaryImgId(imgToDelURL);
    deleteImgFromCloud(imageId);
    try {
      await axios.patch(
        `https://fancreate-backend.onrender.com/api/v1/conversations/${conversationId}/bg-del`
      );
    } catch (error) {
      console.log(error);
    }
    dispatch(setBackgroundImg(null));
    setBgBlob(null);
  };
  return (
    <div className="bg-img-tools">
      <img
        src="./delete-bg.png"
        role="button"
        className="img-tool-button"
        onClick={removeBackgroundImg}
        alt="Delete chat background button"
      ></img>
    </div>
  );
}
export default function ChatTools() {
  const dispatch = useDispatch();
  const activeConversation = useActiveConvo();
  const [bgBlob, setBgBlob] = useState(null);
  const detailsUpdating = useSelector((state) => state.chat.detailsUpdating);
  const backgroundImg = useSelector((state) => state.chat.backgroundImg);
  const imgSaved = useSelector((state) => state.chat.imgSaved);
  const activeTab = useSelector((state) => state.active.activeTab);
  const handleYouBubble = (e) => {
    const selectedColor = e.target.value || e.target.dataset.value;
    dispatch(setYouBubbleColor(selectedColor));
  };
  const handleDate = (dateState) => {
    const dates = document.querySelectorAll(".date");
    dates.forEach((date) => {
      date.style.setProperty("opacity", dateState === "on" ? 1 : 0);
    });
  };
  const handleImgUpload = (imageURL, blob) => {
    setBgBlob(blob);
    dispatch(setBackgroundImg(imageURL));
  };
  const handlePersistSysDetails = () => {
    dispatch(updateSysDetails({ conversationId: activeConversation._id }));
  };
  const uploadBgImg = async () => {
    if (activeConversation?.bgImg) {
      const conversationId = activeConversation._id;
      const oldImgLink = await getCloudinaryImgId(activeConversation?.bgImg);
      await deleteImgFromCloud(oldImgLink);
      try {
        await axios.patch(
          `https://fancreate-backend.onrender.com/api/v1/conversations/${conversationId}/bg-del`
        );
      } catch (error) {
        console.log(error);
      }
    }

    const bgImgLink = await uploadImgToCloud(bgBlob);
    dispatch(
      updateBackgroundImg({
        conversationId: activeConversation._id,
        bgImgLink: bgImgLink,
      })
    );
  };
  useEffect(() => {
    dispatch(setBackgroundImg(activeConversation?.bgImg));
  }, [dispatch, activeConversation?.bgImg]);
  return (
    <div
      className={`chat-tools__primary__parent ${
        activeTab === "chat" ? "visible" : "invisible"
      }`}
    >
      <Row className="tools-div p-2 align-items-center justify-content-center">
        <div className="setting-label">
          <span className="text-dark">Bubble Color:</span>
          <div className="d-grid options">
            <Button
              className="green-text"
              data-value="#00e34d"
              onClick={(e) => handleYouBubble(e)}
            >
              Green Text{" "}
            </Button>
            <Button
              className="blue-text"
              data-value="#007aff"
              onClick={(e) => handleYouBubble(e)}
            >
              Blue Text
            </Button>
            <Button
              className="d-grid align-items-center color-picker-align"
              role="contentinfo"
              title="Custom chat bubble color for sender button"
            >
              <label className="d-flex align-items-center">
                <span style={{ fontWeight: "bold", color: "#2d3033" }}>
                  Custom:
                </span>{" "}
                <input
                  type="color"
                  className="ml-1"
                  onChange={(e) => handleYouBubble(e)}
                ></input>
              </label>
            </Button>
          </div>
        </div>
      </Row>
      <Row className="tools-div p-2 align-items-center justify-content-center">
        <div className="setting-label">
          <span className="text-dark ">Date:</span>
          <div className="d-flex options">
            <Button
              className="options-btns primary"
              style={{ width: "250%" }}
              onClick={() => handleDate("on")}
            >
              Always On
            </Button>
            <Button className="options-btns" onClick={() => handleDate("off")}>
              Hover
            </Button>
          </div>
        </div>
      </Row>
      <Row className="tools-div p-2 align-items-center justify-content-center">
        <div className="setting-label">
          <span className="text-dark" style={{ width: "40%" }}>
            Background Image:
          </span>
          <div className="d-flex options" style={{ gap: "0.5rem" }}>
            <OpacitySlider />
            <DeleteBackgroundImg setBgBlob={setBgBlob} />
            <label htmlFor="bg-img-uploader">
              <span className="options-btns btn btn-primary options">
                Select Image{" "}
                <ImageUploader
                  tempImage={handleImgUpload}
                  id="bg-img-uploader"
                />
              </span>
            </label>
            <div className="mini-phone-div">
              <img
                src="/phone.png"
                className="mini-phone"
                alt="Mock smartphone icon to display user's chosen background image"
              ></img>
              <img
                src={backgroundImg || null}
                className={`mini-bg ${!backgroundImg ? "invisible" : ""}`}
                alt="user's chosen background image"
              ></img>
            </div>
            <span
              className="options-btns btn btn-primary options"
              onClick={uploadBgImg}
            >
              {imgSaved ? "Saved!" : "Save"}
            </span>
          </div>
        </div>
      </Row>
      <Row className="tools-div p-2 align-items-center justify-content-center">
        <div className="setting-label" style={{ alignItems: "flex-start" }}>
          <span className="text-dark" style={{ width: "40%" }}>
            System Info:
          </span>
          <div className="d-flex options all-sys-details-options">
            <BatteryControl />
            <TimeControl />
            <WifiLevels />
            <CellSignalControl />
            <Button
              className="options-btns persist-sys-details"
              onClick={() => handlePersistSysDetails()}
            >
              Save to chat{" "}
              <CustomSpinner
                style={{ borderRadius: "50%", width: "1rem", height: "1rem" }}
                loadingType={detailsUpdating}
              />
            </Button>
          </div>
        </div>
      </Row>
    </div>
  );
}
