import { configureStore } from "@reduxjs/toolkit";
import contactsReducer from "./contacts";
import messagesReducer from "./messages";
import activeReducer from "./active";
import chatReducer from "./chattools";
import authReducer from "./auth";
import adminReducer from "./admin";

// Action Sanitizer
const actionSanitizer = (action) => {
  if (action.type === "messages/sendMessage" && action.payload.pfp) {
    return { ...action, payload: { ...action.payload, pfp: "<<PFP_URL>>" } };
  }
  return action;
};

// State Sanitizer
const stateSanitizer = (state) => {
  if (state.messages) {
    return {
      ...state,
      messages: {
        ...state.messages,
        // Sanitize user profile pictures
        users: state.messages.users.map((user) => ({
          ...user,
          pfp: user.pfp ? "<<PFP_URL>>" : user.pfp,
        })),
      },
    };
  }
  return state;
};

const store = configureStore({
  reducer: {
    contacts: contactsReducer,
    messages: messagesReducer,
    active: activeReducer,
    chat: chatReducer,
    auth: authReducer,
    admin: adminReducer,
  },
  devTools: {
    actionSanitizer,
    stateSanitizer,
  },
});
export default store;
