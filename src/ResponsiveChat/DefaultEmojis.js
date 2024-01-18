import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Emoji } from "emoji-picker-react";
import { addEmojiReact, setTargetToEditId } from "../redux/messages";
import { setEmojiPickerOpen } from "../redux/chattools";
export default function DefaultEmojis({ message }) {
  const dispatch = useDispatch();
  const targetToEditId = useSelector((state) => state.messages.targetToEditId);
  const isEmojiPickerOpen = useSelector(
    (state) => state.chat.isEmojiPickerOpen
  );
  const handleEmojiReact = (e, message) => {
    const emojiCode = e.target.closest("span")?.getAttribute("data-emoji-code");
    const msgId = message._id;
    if (emojiCode) {
      dispatch(setTargetToEditId(null));
      dispatch(addEmojiReact({ msgId, emojiCode }));
    }
  };
  return (
    <div
      className={`emojis-react p-1 gap-1 ${
        message?._id === targetToEditId ? "opacity-100" : "opacity-0"
      } ${message?.senderId === "1" ? "right" : "left"} `}
      onClick={(e) => handleEmojiReact(e, message)}
    >
      <span data-emoji-code="2764-fe0f">
        <Emoji unified="2764-fe0f" size="24" />
      </span>
      <span data-emoji-code="1f44d">
        <Emoji unified="1f44d" size="24" />
      </span>
      <span data-emoji-code="1f44e">
        <Emoji unified="1f44e" size="24" />
      </span>
      <span data-emoji-code="1f602">
        <Emoji unified="1f602" size="24" />
      </span>
      <span data-emoji-code="1f62e">
        <Emoji unified="1f62e" size="24" />
      </span>
      <span data-emoji-code="1f622">
        <Emoji unified="1f622" size="24" />
      </span>
      <span
        style={{
          borderRadius: "50%",
          textAlign: "center",
          width: "18px",
          height: "18px",
          display: "flex",
        }}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setEmojiPickerOpen(!isEmojiPickerOpen));
        }}
      >
        <img
          src="/ellipsis.png"
          style={{ width: "100%", height: "100%" }}
          alt="More emojis. Unavailable for now"
        ></img>
      </span>
      {/* {isEmojiPickerOpen && <EmojiReact message={message} />} */}
    </div>
  );
}
