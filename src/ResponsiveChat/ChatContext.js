import React, { createContext, useRef, useState } from "react";
import { captureChat } from "../utils/captureChat";
import { downloadImages } from "../utils/captureChat";
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const chatRef = useRef(null);
  const messagesRef = useRef(null);
  const [imgsDownloading, setImgsDownloading] = useState(false);
  const triggerCapture = async () => {
    setImgsDownloading(true);
    const images = await captureChat(messagesRef);
    await downloadImages(images);
    setImgsDownloading(false);
  };
  return (
    <ChatContext.Provider
      value={{
        chatRef,
        messagesRef,
        triggerCapture,
        imgsDownloading,
        setImgsDownloading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
