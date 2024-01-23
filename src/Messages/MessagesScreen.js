import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../css/index.css";
import "./MessagesScreen.css";
import "../css/custom.scss";
import Row from "react-bootstrap/esm/Row";
import { setActiveScreen } from "../redux/active";
import {
  fetchConversations,
  deleteConvo,
  setActiveConvo,
  fetchParticipants,
} from "../redux/messages";

export default function MessagesScreen() {
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.messages.conversations);
  const areMessagesOpen = useSelector((state) => state.active.activeScreen);
  const messagesClass =
    areMessagesOpen === "messages"
      ? "chat-pages messages-page"
      : "chat-pages messages-page d-none";
  const handleClick = (e) => {
    e.preventDefault();
    dispatch(setActiveScreen("contacts"));
  };

  const handleConvoClick = (e, id) => {
    e.preventDefault();
    dispatch(setActiveConvo({ conversationId: id }));
    dispatch(setActiveScreen(null));
  };
  const deleteConversation = (e, convo) => {
    e.preventDefault();
    e.stopPropagation();
    const conversationId = convo._id;
    dispatch(deleteConvo(conversationId));
  };
  useEffect(() => {
    async function fetchMsgsData() {
      const fetchConvosRes = await dispatch(fetchConversations());
      const fetchedConversationsArray = fetchConvosRes.payload;
      if (fetchConversations.fulfilled.match(fetchConvosRes)) {
        for (
          let index = 0;
          index < fetchedConversationsArray?.length;
          index++
        ) {
          dispatch(fetchParticipants(fetchedConversationsArray[index]._id));
        }
      }
    }
    fetchMsgsData();
  }, [dispatch]);
  return (
    <div className={messagesClass} style={{ zIndex: "5" }}>
      <div className="d-flex header">
        <h2
          style={{ fontFamily: "Apple", fontWeight: "bold" }}
          className="contacts-header mb-0 p-2 text-dark fs-1"
        >
          Messages
        </h2>
      </div>

      {conversations?.map((conv, index) => {
        // Check if there are any messages and, if so, get the last one
        const lastMessage =
          conv.messages.length > 0
            ? conv.messages[conv.messages.length - 1].message
            : "...";
        const lastTime =
          conv.messages.length > 0
            ? conv.messages[conv.messages.length - 1].time
            : "...";
        let conversationName = "";
        if (conv.groupChatName) {
          conversationName = conv.groupChatName;
        } else {
          for (let i = 1; i < 4; i++) {
            const participantIndex = conv.participants.length - i;
            if (participantIndex >= 0) {
              conversationName += conv.participants[participantIndex]?.first;
              if (i < 4 && participantIndex > 0) {
                conversationName += ", ";
              } else if (i === 3 && participantIndex > 0) {
                conversationName += "...";
              }
            }
          }
        }

        return (
          <Row
            className="message-row bg-dark p-2 align-items-center"
            key={conv._id}
            onClick={(e) => handleConvoClick(e, conv._id)}
            style={{ cursor: "pointer", zIndex: "9" }}
          >
            <div className="convo-pfp-format">
              {conv.groupChatPfp ? (
                <img
                  className="convo-pfp"
                  src={conv.groupChatPfp}
                  alt="Group Chat"
                ></img>
              ) : conv.participants.length < 3 &&
                conv.participants.length > 1 ? (
                <img
                  className="convo-pfp"
                  alt="default chat"
                  src={conv?.participants[1]?.pfp}
                ></img>
              ) : (
                <img
                  src="/among-us.jpg"
                  className="convo-pfp"
                  alt="placeholder for only one participant in chat"
                ></img>
              )}
            </div>
            <div className="line-wrapper">
              <div className="line-1 text-info ellipsis">
                <span style={{ fontSize: "1.5rem" }} className="ellipsis">
                  <span>{conversationName.trim()}</span>
                  {/* <span>
                  {conv.participants[conv.participants.length - 1]?.last}
                </span> */}
                </span>
                <span>{lastTime}</span>
              </div>
              <div className="line-2">
                <p
                  className="p-0 m-0"
                  style={{
                    opacity: "0.7",
                    color: "lightgray",
                    fontSize: "0.9rem",
                  }}
                >
                  {lastMessage}
                </p>
                <span
                  className="convo-button-wrapper"
                  onClick={(e) => deleteConversation(e, conv)}
                  style={{ zIndex: "10" }}
                >
                  <img
                    className="convo-button img-fluid"
                    src="./light-delete.png"
                    alt="Delete conversation button"
                  ></img>
                </span>
              </div>
            </div>
          </Row>
        );
      })}
      <div
        className="d-flex justify-content-center align-items-center new-msg-div"
        onClick={handleClick}
      >
        <img
          src="/plus-big.png"
          alt="new message icon"
          className="new-msg"
        ></img>
      </div>
    </div>
  );
}
