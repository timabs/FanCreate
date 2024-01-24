import React, { createContext, useRef } from "react";
import { captureChat } from "../utils/captureChat";
import { downloadImages } from "../utils/captureChat";
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const messagesRef = useRef(null);
  const triggerCapture = async () => {
    const images = await captureChat(messagesRef);
    downloadImages(images);
  };
  return (
    <ChatContext.Provider value={{ messagesRef, triggerCapture }}>
      {children}
    </ChatContext.Provider>
  );
};
