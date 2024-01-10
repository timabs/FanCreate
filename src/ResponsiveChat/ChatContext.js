import React, { createContext, useRef } from "react";
import { captureChat } from "../utils/captureChat";
import { downloadImages } from "../utils/captureChat";
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const chatRef = useRef(null);
  const messagesRef = useRef(null);
  const triggerCapture = async () => {
    const images = await captureChat(chatRef, messagesRef);
    downloadImages(images);
  };
  return (
    <ChatContext.Provider value={{ chatRef, messagesRef, triggerCapture }}>
      {children}
    </ChatContext.Provider>
  );
};
