import React, { useState, useEffect } from "react";
import useActiveConvo from "../CustomHooks/activeConvosHooks";
import "./ChatBanner.css";
import SystemDetailsBar from "./SystemDetails/SystemDetails";
import { useDispatch } from "react-redux";
import { setActiveScreen } from "../redux/active";

export default function ChatBanner() {
  const dispatch = useDispatch();
  const activeConversation = useActiveConvo();
  const gcName = activeConversation?.groupChatName;
  const gcPfp = activeConversation?.groupChatPfp;
  const pfpEligibleUsers = activeConversation?.participants
    ? activeConversation.participants.filter((user) => user._id !== "1")
    : [];

  const [shuffledUsers, setShuffledUsers] = useState([]);
  useEffect(() => {
    const randomizeUsers = pfpEligibleUsers
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setShuffledUsers(randomizeUsers);
    if (!activeConversation) {
      setShuffledUsers(null);
    }
  }, [activeConversation?.participants]);

  return (
    <div className="chat-banner">
      <SystemDetailsBar />
      <img
        src="/chev-left.png"
        aria-hidden="true"
        role="button"
        onClick={() => dispatch(setActiveScreen("messages"))}
        className="back-button"
      />
      {gcPfp ? (
        <div className="d-flex flex-direction-row">
          <div className="banner-img-divs">
            <img
              className="banner-imgs"
              src={gcPfp}
              alt="profile pic for group chat in the banner"
            ></img>
          </div>
        </div>
      ) : shuffledUsers?.length < 4 && shuffledUsers.length > 1 ? (
        <div className="d-flex flex-direction-row">
          {shuffledUsers.map((user, index) => (
            <div
              className={`banner-img-divs ${
                index === 0 ? "small left" : index === 1 ? "" : "small"
              }`}
              key={index}
            >
              <img
                className={`banner-imgs ${
                  index === 0 ? "small left" : index === 1 ? "" : "small"
                }`}
                src={shuffledUsers[index]?.pfp}
                alt={`${shuffledUsers[index].first} profile pic`}
              ></img>
            </div>
          ))}
        </div>
      ) : (
        <>
          {pfpEligibleUsers?.map((user, index) => {
            return (
              <div className="banner-img-divs" key={index}>
                <img
                  src={user?.pfp}
                  className="banner-imgs"
                  alt={`${user.first} profile pic`}
                ></img>
              </div>
            );
          })}
        </>
      )}
      {gcName ? (
        <div className="chat-name">
          {gcName}
          {/* <FontAwesomeIcon
            icon={faChevronRight}
            className="to-gc-info"
            role="button"
            onClick={() => {
              dispatch(setActiveScreen("group-chat"));
            }}
          /> */}
          <img
            src="/chev-left.png"
            aria-hidden="true"
            className="to-gc-info"
            role="button"
            onClick={() => {
              dispatch(setActiveScreen("group-chat"));
            }}
          ></img>
        </div>
      ) : pfpEligibleUsers.length > 1 && pfpEligibleUsers.length < 4 ? (
        <div className="chat-name">
          {pfpEligibleUsers?.map((user, index) => (
            <span
              className={pfpEligibleUsers.indexOf(user) !== 0 ? "spacing" : ""}
              key={index}
            >
              {user?.first?.trim()}
              {pfpEligibleUsers.indexOf(user) !== pfpEligibleUsers.length - 1
                ? ","
                : ""}
            </span>
          ))}
          <img
            src="/chev-left.png"
            aria-hidden="true"
            className="to-gc-info"
            role="button"
            onClick={() => {
              dispatch(setActiveScreen("group-chat"));
            }}
          ></img>
        </div>
      ) : pfpEligibleUsers.length === 1 ? (
        <div className="chat-name" style={{ marginLeft: "unset" }}>
          <span>{pfpEligibleUsers[0]?.first}</span>
        </div>
      ) : (
        <div className="chat-name" style={{ marginLeft: "unset" }}>
          <span>{pfpEligibleUsers.length} people</span>
        </div>
      )}
    </div>
  );
}
