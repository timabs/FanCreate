import React, { useState, useRef, useEffect } from "react";
import useActiveScreen from "../../CustomHooks/useActiveScreen";
import "./GroupChat.css";
import { Form } from "react-bootstrap";
import CustomSpinner from "../../utils/Spinner";
import ImageUploader from "../../ImageHandling/ImageUploader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import useActiveConvo from "../../CustomHooks/activeConvosHooks";
import { setActiveScreen } from "../../redux/active";
import { useDispatch, useSelector } from "react-redux";
import { editGroupChatName, editGroupChatPfp } from "../../redux/messages";
import {
  deleteImgFromCloud,
  getCloudinaryImgId,
  uploadImgToCloud,
} from "../../utils/cloudinary";
import { useImage } from "../../ImageHandling/ImageContext";
import { useDebounce } from "../../CustomHooks/useDebounce";

export default function GroupChat() {
  const dispatch = useDispatch();
  const gcNameRef = useRef();
  const activeScreen = useActiveScreen();
  const activeConversation = useActiveConvo();
  const imgIsUploading = useSelector((state) => state.chat.imgIsUploading);
  const gcUpdating = useSelector((state) => state.messages.gcUpdating);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const { updateImage } = useImage();
  const [gcName, setGcName] = useState(
    activeConversation?.groupChatName ? activeConversation.groupChatName : ""
  );
  const groupChatClass =
    activeScreen === "group-chat"
      ? "group-chat-form chat-pages"
      : "group-chat-form chat-pages d-none";

  const handleCancel = (e) => {
    setImageBlob(null);
    setSelectedImage(activeConversation.groupChatPfp);
    dispatch(setActiveScreen(null));
  };

  const handleSubmit = async (e) => {
    let newImageUrl = selectedImage;
    let oldImgDeleted = false;
    const gcPfp = activeConversation.groupChatPfp;
    if (imageBlob) {
      newImageUrl = await uploadImgToCloud(imageBlob);
      updateImage(newImageUrl);
      setSelectedImage(newImageUrl);
      dispatch(
        editGroupChatPfp({
          conversationId: activeConversation._id,
          gcPfp: newImageUrl,
        })
      );
    }
    if (gcPfp && gcPfp !== newImageUrl) {
      const oldImgId = getCloudinaryImgId(gcPfp);
      await deleteImgFromCloud(oldImgId);
      oldImgDeleted = true;
    }
    dispatch(
      editGroupChatName({
        conversationId: activeConversation._id,
        gcName: gcName,
      })
    );
    dispatch(setActiveScreen(null));
  };
  const debouncedSubmit = useDebounce(handleSubmit, 500);
  const handleImageUpload = (imageURL, blob) => {
    setImageBlob(blob);
    setSelectedImage(imageURL);
  };
  const editGroupChatNameHandler = () => {
    const gcNameElem = gcNameRef.current;
    gcNameElem.setAttribute("contentEditable", "true");
    gcNameElem.addEventListener("focus", () => {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(gcNameElem);
      selection.removeAllRanges();
      selection.addRange(range);
    });
    gcNameElem.focus();
    gcNameElem.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (gcNameElem.textContent !== "") {
          setGcName(gcNameElem.textContent);
        } else {
          gcNameElem.textContent = gcName; //add alert "msg cannot be empty"
        }

        gcNameElem.blur();
        gcNameElem.contentEditable = "false";
      }
    });
    gcNameElem.addEventListener("focusout", () => {
      if (gcNameElem.textContent === "") {
        gcNameElem.textContent = gcName;
      }
      setGcName(gcNameElem.textContent);
      gcNameElem.contentEditable = "false";
    });
  };

  useEffect(() => {
    if (activeConversation?.groupChatPfp) {
      setSelectedImage(activeConversation.groupChatPfp);
    }
    if (activeConversation?.groupChatName) {
      setGcName(activeConversation.groupChatName);
    } else {
      let names = "";
      for (let i = 1; i < 4; i++) {
        const participantIndex = activeConversation?.participants.length - i;
        if (participantIndex >= 0) {
          names += activeConversation?.participants[participantIndex]?.first;
          if (i < 4 && participantIndex > 0) {
            names += ", ";
          } else if (i === 3 && participantIndex > 0) {
            names += "...";
          }
        }
      }
      setGcName(names);
    }
  }, [activeConversation]);

  return (
    <div className={groupChatClass}>
      <CustomSpinner
        style={{ position: "absolute", borderRadius: "0.5rem", top: "50%" }}
        loadingType={gcUpdating}
      />
      <Form
        style={{ width: "100%", flexDirection: "column" }}
        className="d-flex justify-content-center"
      >
        <Form.Group className="d-flex" style={{ width: "100%" }}>
          <div
            className="d-flex justify-content-between mb-3"
            style={{
              height: "fit-content",
              width: "100%",
              fontSize: "1rem",
              flexDirection: "row",
              padding: "0.75rem",
            }}
          >
            <p
              className="mb-0"
              style={{ color: "#017afe", cursor: "pointer" }}
              onClick={handleCancel}
            >
              Cancel
            </p>
            <p className="mb-0" style={{ fontWeight: "bold" }}>
              Edit Group
            </p>
            <p
              className="mb-0"
              style={{
                fontWeight: "bold",
                color: "#017afe",
                cursor: "pointer",
              }}
              onClick={() => debouncedSubmit()}
            >
              Done
            </p>
          </div>
        </Form.Group>
        <Form.Group
          className="d-flex"
          style={{ flexDirection: "column", alignItems: "center" }}
        >
          <div
            className="pfp-div d-flex align-items-center justify-content-center"
            style={{ position: "relative" }}
          >
            <CustomSpinner
              style={{ position: "absolute", borderRadius: "0.5rem" }}
              loadingType={imgIsUploading}
            />
            {selectedImage ? (
              <img src={selectedImage} alt="uploaded" />
            ) : (
              <img src="./among-us.jpg" className="among-us" alt="default" />
            )}
          </div>
          <Form.Label className="add-photo-label">
            <FontAwesomeIcon
              icon={faCloudArrowUp}
              style={{ color: "#000000" }}
              role="button"
            />
            <ImageUploader tempImage={handleImageUpload} id="group-img-up" />
          </Form.Label>
        </Form.Group>
        <Form.Group className="d-flex align-items-center justify-content-center">
          <span
            style={{ color: "#017afe" }}
            className="gc-names"
            ref={gcNameRef}
          >
            {gcName}
          </span>{" "}
          <FontAwesomeIcon
            icon={faPenToSquare}
            style={{ color: "#000000" }}
            role="button"
            className="edit-gc-names"
            onClick={() => editGroupChatNameHandler()}
          />
        </Form.Group>
        <div>
          <h2 className="m-2 h3" style={{ fontWeight: "bold" }}>
            Members
          </h2>
          <div className="m-2" style={{ overflow: "scroll" }}>
            {activeConversation?.participants?.map((user, index) =>
              user._id === "1" ? null : (
                <div className="gc-user-card mb-2" key={index}>
                  <div
                    className="pfp-div"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <img src={user.pfp} alt="user profile pic"></img>
                  </div>
                  <span>
                    {user.first} {user.last}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}
