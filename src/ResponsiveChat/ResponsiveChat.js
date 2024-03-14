import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import {
  setTargetToEditId,
  createConversation,
  createMessage,
  fetchMessages,
  setActiveConvo,
  fetchActiveConvo,
  fetchConversations,
  fetchParticipants,
  setMsgById,
  setIsChangeSenderMode,
} from "../redux/messages";
import { useDispatch, useSelector } from "react-redux";
import { ChatContext } from "./ChatContext";
import ChatBanner from "./ChatBanner";
import useActiveConvo from "../CustomHooks/activeConvosHooks";
import useActiveUser from "../CustomHooks/useActiveUser";
import { getCurrentTime } from "../utils/timeUtils";
import EditDetails from "./EditDetails";
import useLoggedIn from "../CustomHooks/checkLoggedIn";
import CustomSpinner from "../utils/Spinner";
import ChatStartupScreen from "./ChatStartupScreen";
import ImageUploader from "../ImageHandling/ImageUploader";
import { uploadImgToCloud } from "../utils/cloudinary";
import { useDebounce } from "../CustomHooks/useDebounce";
// import EmojiReact from "./EmojiPicker";
import { Emoji } from "emoji-picker-react";
import { setEmojiPickerOpen } from "../redux/chattools";
import DefaultEmojis from "./DefaultEmojis";
// import GroupChat, {
//   GroupChatContactScreen,
// } from "../Contacts/GroupChat/GroupChatContactScreen";

function Chat() {
  const dispatch = useDispatch();
  const [currentMessages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [imgInMsg, setImgInMsg] = useState("");
  const [blobInMsg, setBlobInMsg] = useState(null);
  const [imgPreviewOpen, setImgPreviewOpen] = useState(false);
  const messageContainerRef = useRef(null);
  const { chatRef } = useContext(ChatContext);
  const { messagesRef } = useContext(ChatContext);
  const bgRef = useRef(null);
  const activeUser = useActiveUser();
  const activeConversation = useActiveConvo();
  const checkLoggedIn = useLoggedIn();
  const youBubbleColor = useSelector((state) => state.chat.youBubbleColor);
  const backgroundImg = useSelector((state) => state.chat.backgroundImg);
  const imgIsUploading = useSelector((state) => state.chat.imgIsUploading);
  const opacity = useSelector((state) => state.chat.opacity);
  const dateVis = useSelector((state) => state.chat.dateVis);
  const isEmojiPickerOpen = useSelector(
    (state) => state.chat.isEmojiPickerOpen
  );
  const targetToEditId = useSelector((state) => state.messages.targetToEditId);
  const convosLoading = useSelector((state) => state.messages.convosLoading);
  const oneMessageById = useSelector((state) => state.messages.oneMessageById);

  async function convoCreationWithRes(withMessage = false, newMessage) {
    const createConvoResponse = await dispatch(
      createConversation({
        participants: [
          { first: "me", pfp: null, defaultTexter: true, _id: "1" },
        ],
      })
    );
    if (createConversation.fulfilled.match(createConvoResponse)) {
      const newConversationId = createConvoResponse.payload._id;
      await dispatch(
        setActiveConvo({
          conversationId: newConversationId,
        })
      );
      if (withMessage) {
        await dispatch(
          createMessage({
            conversationId: newConversationId,
            messageObj: newMessage,
          })
        );
      }
    }
  }

  const setCombinedRefs = useCallback(
    (node) => {
      messageContainerRef.current = node;

      messagesRef.current = node;
    },
    [messagesRef]
  );
  const messagesLoading = useSelector(
    (state) => state.messages.messagesLoading
  );
  const sendMessageHandler = async () => {
    dispatch(setIsChangeSenderMode(false));
    const currentDate = getCurrentTime();
    const fullDate = new Date().toLocaleDateString();
    if (messageInput.trim() !== "" || imgInMsg) {
      const newImgUrl = imgInMsg ? await uploadImgToCloud(blobInMsg) : null;
      const senderName = activeUser.defaultTexter
        ? "me"
        : `${activeUser?.first} ${activeUser?.last}`;
      const senderId = activeUser._id;

      const newMessage = {
        message: messageInput,
        senderId,
        senderName,
        date: fullDate,
        time: currentDate,
        pfp: `${activeUser.pfp}`,
        imgInMsg: newImgUrl,
        replyingTo: oneMessageById ? oneMessageById : null,
      };
      if (!activeConversation) {
        await convoCreationWithRes(true, newMessage);
      } else {
        dispatch(
          createMessage({
            conversationId: activeConversation._id,
            messageObj: newMessage,
          })
        );
      }
      setMessages([...currentMessages, newMessage]);
      setMessageInput("");
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }
      setImgPreviewOpen(false);
      setImgInMsg("");
      dispatch(setMsgById(null));
    }
  };

  const debouncedSendMessage = useDebounce(sendMessageHandler, 1000);
  const addImgToMsg = async (imageURL, blob) => {
    setImgInMsg(imageURL);
    setBlobInMsg(blob);
  };
  const currentMessageRef = useRef();
  const toggleEditDetails = (message) => {
    currentMessageRef.current = message;

    if (message._id !== targetToEditId) {
      dispatch(setTargetToEditId(message._id));
    } else {
      // dispatch(setTargetToEditId(null));
    }
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      const message = currentMessageRef?.current;
      if (
        e.target.closest(".edit-details") === null &&
        e.target.closest(`[data-id="${message?._id}"]`) === null &&
        e.target.closest(".emojis-react") === null &&
        !isEmojiPickerOpen
      ) {
        dispatch(setTargetToEditId(null));
        dispatch(setEmojiPickerOpen(false));
      }
    };
    if (targetToEditId !== null) {
      document.body.addEventListener("click", (e) => handleClickOutside(e));
    }
    return () => {
      document.body.removeEventListener("click", (e) => handleClickOutside(e));
    };
  }, [targetToEditId, isEmojiPickerOpen, dispatch]);

  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchConversations());
      const fetchActiveRes = await dispatch(fetchActiveConvo());
      if (fetchActiveConvo.fulfilled.match(fetchActiveRes)) {
        if (fetchActiveRes.payload?.activeConversationId) {
          const convoId = fetchActiveRes.payload.activeConversationId;
          dispatch(fetchMessages(convoId));
          dispatch(fetchParticipants(convoId));
        } else {
          convoCreationWithRes(false);
        }
      }
    }
    fetchData();
  }, [checkLoggedIn, dispatch]);

  useEffect(() => {
    const initialMessages = activeConversation
      ? activeConversation.messages
      : [];
    setMessages(initialMessages);
  }, [activeConversation]);

  useEffect(() => {
    const submitMsg = document.querySelector(".submit-msg");
    if (messageContainerRef.current) {
      messageContainerRef.current.style.setProperty(
        "--dynamic-color",
        youBubbleColor
      );
    }

    submitMsg.style.setProperty("--dynamic-color", youBubbleColor);
  }, [youBubbleColor]);

  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.style.setProperty("--bg-img", `url(${backgroundImg})`);
    }
  }, [backgroundImg]);
  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.style.opacity = opacity;
    }
  }, [opacity]);

  const bgImgStyle = {
    position: "absolute",
  };
  const msgLoadStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
  };

  const handleFullscreenChange = () => {
    const chat = chatRef.current;
    if (!document.fullscreenElement) {
      chat.classList.remove("fullscreen");
    } else {
      chat.classList.add("fullscreen");
    }
  };
  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <form
      className="chat visible"
      onSubmit={(e) => {
        e.preventDefault();
        debouncedSendMessage();
      }}
    >
      <div
        className={`chat-modal ${targetToEditId ? "opacity-1" : "opacity-0"}`}
      ></div>
      <ChatStartupScreen />
      <ChatBanner />

      <div
        className="messages"
        ref={setCombinedRefs}
        style={{ position: "relative" }}
      >
        <div className="bg-div" ref={bgRef}></div>
        <CustomSpinner style={bgImgStyle} loadingType={imgIsUploading} />
        <CustomSpinner style={msgLoadStyle} loadingType={convosLoading} />

        {currentMessages.map((message, index) => {
          const sender = activeConversation?.participants?.find(
            (user) => user?._id === message?.senderId
          );
          const senderName =
            message?.senderName === "me"
              ? "me"
              : `${sender?.first ? sender.first : ""} ${
                  sender?.last ? sender.last : ""
                }`;
          const senderPfp = sender?.pfp;
          return (
            <div
              className={`txt-structure ${
                message?.senderId === "1" ? "right" : "left"
              } ${
                activeConversation?.participants?.length > 2 ? "" : "no-pfp"
              } ${messagesLoading ? "invisible" : "visible"}`}
              key={index}
            >
              {activeConversation?.participants?.length > 2 &&
              senderName !== "me" ? (
                <div className="message-icons">
                  <img src={senderPfp} alt={`${senderName} profile pic`}></img>
                </div>
              ) : null}
              {message?.senderId === "1" ? (
                ""
              ) : (
                <span className="sender visible">{senderName}</span>
              )}

              <div
                className={`message ${
                  message?.senderId === "1" ? "myMessage" : "fromThem"
                }`}
                key={index}
              >
                <div
                  className={`emoji-react-bubble ${
                    message?.emojiReact ? "d-flex" : "d-none"
                  } ${message?.senderId === "1" ? "right" : "left"}`}
                >
                  <Emoji unified={message.emojiReact} size="1.25rem" />
                </div>
                <span
                  onDoubleClick={() => {
                    dispatch(setIsChangeSenderMode(false));
                    toggleEditDetails(message);
                  }} //debounce
                  data-id={message._id}
                  tabIndex={0}
                >
                  {message.replyingTo ? (
                    <div
                      className={`reply-content in-msg p-2 mb-2 ${
                        message.replyingTo ? "" : "d-none"
                      }`}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {message.replyingTo?.senderName}
                      </span>
                      <span className="">{message.replyingTo?.message}</span>
                    </div>
                  ) : null}
                  {message?.message}

                  {message.imgInMsg ? (
                    <div className="sent-image">
                      <img src={message.imgInMsg} alt=""></img>
                    </div>
                  ) : null}
                  {message.imgInMsg ? <div className="sent-reply"></div> : null}
                </span>
              </div>
              <div
                className={`date ${dateVis ? "opacity-100" : "opacity-none"}`}
              >
                {message?.time}
              </div>
              <DefaultEmojis message={message} />
              <EditDetails
                message={message}
                setImgPreview={setImgPreviewOpen}
              />
            </div>
          );
        })}
      </div>
      <div
        className={`chat-extension ${
          imgPreviewOpen ? "opened" : ""
        } image-upload`}
        style={{ backgroundColor: "#e2e2e2" }}
      >
        <p
          className={`${imgPreviewOpen ? "opacity-1" : "opacity-0"} ${
            imgInMsg ? "opacity-0" : "opacity-1"
          } position-absolute`}
        >
          Please select an image
        </p>
        {imgInMsg ? (
          <div style={{ position: "relative" }}>
            <div>
              <img
                src={imgInMsg}
                className="img-in-msg-preview-sm mb-2"
                alt="uploaded preview"
              />
            </div>
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                setImgInMsg(null);
              }}
            >
              <img src="minus.png" className="minus" alt="remove"></img>
            </span>
          </div>
        ) : null}
        <img
          src="close.png"
          className={`close-button ${imgPreviewOpen ? "" : "opacity-0"}`}
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            setImgPreviewOpen(false);
            setImgInMsg("");
          }}
          aria-hidden="true"
          alt="hide upload preview"
        ></img>
      </div>
      <div
        className={`chat-extension ${
          oneMessageById ? "opened" : ""
        } reply-div px-2 py-1`}
      >
        <div className={`reply-content p-2 ${oneMessageById ? "" : "d-none"}`}>
          <span style={{ fontWeight: "bold" }}>
            {oneMessageById?.senderName}
          </span>
          <span className="ml-1">{oneMessageById?.message}</span>
        </div>
        <img
          src="close.png"
          className={`close-button ${oneMessageById ? "" : "d-none"}`}
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setMsgById(null));
          }}
          aria-hidden="true"
          alt="hide preview"
        ></img>
      </div>
      <div className="semantic-input-div d-flex">
        <label
          htmlFor="img-in-msg-uploader"
          onClick={() => {
            setImgPreviewOpen(true);
            dispatch(setMsgById(null));
          }}
          style={{ cursor: "pointer" }}
        >
          <div id="img-up-msg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="1.75rem"
              height="1.75rem"
              viewBox="0 0 30 30"
              style={{ fill: "#bfbfbf", marginLeft: "0.5rem" }}
            >
              <path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M21,16h-5v5 c0,0.553-0.448,1-1,1s-1-0.447-1-1v-5H9c-0.552,0-1-0.447-1-1s0.448-1,1-1h5V9c0-0.553,0.448-1,1-1s1,0.447,1,1v5h5 c0.552,0,1,0.447,1,1S21.552,16,21,16z"></path>
            </svg>
          </div>
          <ImageUploader tempImage={addImgToMsg} id="img-in-msg-uploader" />
        </label>

        <input
          id="message-input-field"
          className="input-msg-field"
          type="text"
          placeholder="Your message"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <input type="submit" value="Send" className="submit-msg" />
      </div>
    </form>
  );
}

export default Chat;
