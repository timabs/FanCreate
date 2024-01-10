import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEmojiReact, setTargetToEditId } from "../redux/messages";
import "./EmojiPicker.css";
import EmojiPicker from "emoji-picker-react";
import { setEmojiPickerOpen } from "../redux/chattools";

export default function EmojiReact({ message }) {
  const dispatch = useDispatch();
  const isEmojiPickerOpen = useSelector(
    (state) => state.chat.isEmojiPickerOpen
  );
  const handleReact = (message, emojiData) => {
    const msgId = message._id;
    const emojiCode = emojiData.unified;
    dispatch(setEmojiPickerOpen(false));
    dispatch(addEmojiReact({ msgId: msgId, emojiCode }));
  };

  return (
    <div
      className={`emoji-picker-div ${isEmojiPickerOpen ? `d-flex` : `d-none`}`}
    >
      <EmojiPicker
        onEmojiClick={(emojiData, e) => {
          e.preventDefault();
          handleReact(message, emojiData);
        }}
        width="100%"
        height="100%"
        emojiStyle="native"
        lazyLoadEmojis="true"
      />
    </div>
  );
}
