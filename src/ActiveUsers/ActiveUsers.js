import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useActiveConvo from "../CustomHooks/activeConvosHooks";
import useActiveUser from "../CustomHooks/useActiveUser";
import {
  changeAddUserMode,
  deleteUserFromConvo,
  editSender,
  setActiveUser,
  setIsChangeSenderMode,
  updateActiveConvoUser,
} from "../redux/messages";
import { setActiveScreen } from "../redux/active";
import { clearRecentlyEdited, setUsersVisible } from "../redux/contacts";
import { Col } from "react-bootstrap";
import "./ActiveUsers.css";

export default function ActiveUsers() {
  //state and hooks
  const dispatch = useDispatch();
  const activeConvo = useActiveConvo();
  const activeUser = useActiveUser();
  const chattersIcon = useRef();
  const recentlyEditedContactId = useSelector(
    (state) => state.contacts.recentlyEditedContactId
  );
  const isTextersVisible = useSelector(
    (state) => state.contacts.isTextersVisible
  );
  const contacts = useSelector((state) => state.contacts.contactsArr);
  const isChangeSenderMode = useSelector(
    (state) => state.messages.isChangeSenderMode
  );
  const newSenderMsg = useSelector((state) => state.messages.newSenderMsg);

  //styles, classes, and elements
  const iconDivStyles = {
    width: "2vw",
    height: "2vw",
    borderRadius: "50%",
    cursor: "pointer",
  };
  const textersVisibleClass = isTextersVisible
    ? "users-extension opacity-100"
    : "users-extension opacity-0";
  const buttons = [
    {
      src: "/plus-button.png",
      alt: "Plus button gif",
      classes: "img-fluid plus",
      id: "plus",
    },
    {
      src: "/delete.png",
      alt: "Delete button gif",
      classes: "img-fluid delete",
      id: "delete",
    },
  ];

  //toggle chatters column (active chatters)
  const toggleChatters = () => {
    dispatch(setUsersVisible());
    if (chattersIcon.current) {
      chattersIcon.current.classList.toggle("indicator");
    }
  };

  const handleUserChange = (user) => {
    if (user === "me") {
      dispatch(
        setActiveUser({ first: "me", pfp: null, defaultTexter: true, _id: "1" })
      );
    } else {
      dispatch(setActiveUser(user));
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    switch (e.target.id) {
      case "plus":
        dispatch(setActiveScreen("contacts"));
        dispatch(changeAddUserMode("add-to-existing"));
        break;
      case "delete":
        dispatch(setActiveScreen(null));
        break;
      default:
        break;
    }
  };
  const handleEditSender = (user) => {
    if (!isChangeSenderMode) return;
    dispatch(
      editSender({
        msgId: newSenderMsg._id,
        newSenderData: {
          _id: user._id,
          senderName: `${user.first} ${user.last}`,
          phoneNumber: user.phoneNumber,
          pfp: user.pfp,
        },
      })
    );
    dispatch(setIsChangeSenderMode(false));
  };
  useEffect(() => {
    if (recentlyEditedContactId) {
      const matchingUserIndex = activeConvo?.participants?.findIndex(
        (user) => user._id === recentlyEditedContactId
      );
      if (matchingUserIndex !== -1) {
        const updatedContact = contacts.find(
          (contact) => contact._id === recentlyEditedContactId
        );
        if (activeConvo) {
          dispatch(updateActiveConvoUser(updatedContact));
        }
      }
      dispatch(clearRecentlyEdited());
    }
  }, [
    recentlyEditedContactId,
    activeConvo?.participants,
    dispatch,
    contacts,
    activeConvo,
  ]);
  return (
    //whole texters column including initial button
    <Col
      lg={2}
      md={2}
      xxl={3}
      className="d-grid align-items-end mb-5 texters-col"
      style={{ paddingRight: "0.5rem" }}
    >
      <Col style={{}} className={textersVisibleClass}>
        <div className="button-div">
          {buttons.map((button, index) => {
            const toScale = document.getElementById("delete")?.parentElement;
            return (
              <div
                className="portraits mt-1"
                key={index}
                style={{ width: "1.5vw", height: "1.5vw" }}
                onDragOver={(e) => {
                  e.preventDefault();
                  toScale.style.scale = 1.35;
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  toScale.style.scale = 1;
                }}
                onDrop={(e) => {
                  toScale.style.scale = 1;
                  e.preventDefault();
                  if (button.id === "delete") {
                    const index = parseInt(
                      e.dataTransfer.getData("text/plain"),
                      10
                    );
                    const id = activeConvo.participants[index]?._id;
                    if (id) {
                      dispatch(
                        deleteUserFromConvo({
                          conversationId: activeConvo._id,
                          participantId: id,
                        })
                      );
                    }
                  }
                }}
              >
                <img
                  id={button.id}
                  src={button.src}
                  alt={button.alt}
                  className={button.classes}
                  onClick={handleClick}
                  style={{ cursor: "pointer" }}
                  draggable="false"
                ></img>
              </div>
            );
          })}
        </div>
        <div className={`text-icon-div ${isChangeSenderMode ? "select" : ""}`}>
          {activeConvo?.participants?.map((user, index) => {
            if (user?._id === "1") return null;
            return (
              <div
                key={index}
                draggable={true}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", index.toString())
                }
                className={`portraits draggable ${
                  activeUser?.pfp === user?.pfp ? "speaker-indicator" : ""
                }`}
                style={iconDivStyles}
                data-user-id={user?._id}
                data-user-name={`${user?.first} ${user?.last}`}
                onClick={() => {
                  handleEditSender(user);
                  handleUserChange(user);
                }}
              >
                <img
                  src={user?.pfp}
                  alt={`Uploaded img ${index}`}
                  className="img-fluid"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            );
          })}

          <div
            className={`texters bg-dark d-flex justify-content-center align-items-center ${
              activeUser?.defaultTexter === true ? "speaker-indicator" : ""
            }`}
            style={iconDivStyles}
            onClick={() => {
              handleEditSender({
                first: "me",
                pfp: null,
                defaultTexter: true,
                _id: "1",
              });
              handleUserChange("me");
            }}
          >
            <i
              className="fa-solid fa-user text-light d-flex justify-content-center align-items-center"
              id="you"
              style={{ fontSize: "1.25vw" }}
            ></i>
          </div>
        </div>
      </Col>
      <div
        className="d-flex"
        style={{ flexDirection: "column", marginRight: "0.25rem" }}
      >
        <div
          ref={chattersIcon}
          className="bg-dark d-flex justify-content-center align-items-center users-icon-div"
          onClick={toggleChatters}
          style={iconDivStyles}
        >
          <i
            className="fa-solid fa-users text-light justify-content-center align-items-center d-flex"
            id="users-icon"
            style={{ cursor: "pointer", fontSize: "1.25vw" }}
          ></i>
        </div>
      </div>
    </Col>
  );
}
