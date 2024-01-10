import React, { useState, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTargetToEditId,
  setIsChangeSenderMode,
  setNewSenderMsg,
  editMsg,
  deleteMsg,
  setMsgById,
} from "../redux/messages";
import { setUsersVisible } from "../redux/contacts";
import useActiveConvo from "../CustomHooks/activeConvosHooks";
import { Emoji } from "emoji-picker-react";
import { addEmojiReact } from "../redux/messages";
import { setEmojiPickerOpen } from "../redux/chattools";

export default function EditDetails({ message, setImgPreview }) {
  const dispatch = useDispatch();
  const isEmojiPickerOpen = useSelector(
    (state) => state.chat.isEmojiPickerOpen
  );
  const activeConversation = useActiveConvo();
  const targetToEditId = useSelector((state) => state.messages.targetToEditId);
  const oneMessageById = useSelector((state) => state.messages.oneMessageById);
  const handleReply = (msg) => {
    dispatch(setTargetToEditId(null));
    dispatch(setMsgById(msg._id));
    setImgPreview(false);
  };

  const editMessageHandler = (msg) => {
    dispatch(setTargetToEditId(null));
    const msgElem = document.querySelector(`[data-id="${msg._id}"]`);
    msgElem.setAttribute("contentEditable", "true");
    msgElem.addEventListener("focus", () => {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(msgElem);
      selection.removeAllRanges();
      selection.addRange(range);
    });
    msgElem.focus();
    msgElem.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (msgElem.textContent !== "") {
          await dispatch(
            editMsg({
              msgId: msg._id,
              newMsgData: msgElem.textContent,
            })
          );
        } else {
          msgElem.textContent = msg.message; //add alert "msg cannot be empty"
        }

        msgElem.blur();
        msgElem.contentEditable = "false";
      }
    });
    msgElem.addEventListener("focusout", () => {
      if (msgElem.textContent === "") {
        msgElem.textContent = msg.message;
      }
      msgElem.contentEditable = "false";
    });
  };

  const handleSenderChange = (msg) => {
    dispatch(setTargetToEditId(null));
    dispatch(setUsersVisible(true));
    dispatch(setIsChangeSenderMode(true));
    dispatch(setNewSenderMsg(msg));
  };
  const handleDeleteMsg = async (msg) => {
    dispatch(setTargetToEditId(null));
    await dispatch(
      deleteMsg({ msgId: msg._id, conversationId: msg.conversationId })
    );
  };
  const overrideLeftPos = {
    left: "0",
  };

  return (
    <div
      className={`edit-details ${
        message?._id === targetToEditId ? "opacity-100" : "opacity-0"
      } ${message?.senderId === "1" ? "right" : "left"} `}
      style={
        activeConversation?.participants.length < 3 && message?.senderId !== "1"
          ? overrideLeftPos
          : {}
      }
    >
      <span className="p-1" role="button" onClick={() => handleReply(message)}>
        Reply
      </span>
      <span
        className="p-1"
        role="button"
        onClick={() => editMessageHandler(message)}
      >
        Edit Message
      </span>
      <span
        className="p-1"
        role="button"
        onClick={() => {
          handleSenderChange(message);
        }}
      >
        Change Sender
      </span>
      <span
        className="p-1"
        role="button"
        style={{ color: "red" }}
        onClick={() => handleDeleteMsg(message)}
      >
        Delete Message
      </span>
    </div>
  );
}
