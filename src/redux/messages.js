import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { deleteImgFromCloud, getCloudinaryImgId } from "../utils/cloudinary";
const apiUrl = "https://fancreate-backend.onrender.com";

const initialState = {
  users: [{ first: "me", pfp: null, defaultTexter: true, _id: "1" }],
  conversations: [],
  activeConversationId: null,
  activeConversation: null,
  activeUser: null,
  addUsersMode: null,
  targetToEditId: 0,
  isChangeSenderMode: false,
  newSenderMsg: null,
  messagesLoading: false,
  convosLoading: false,
  gcUpdating: false,
  oneMessageById: null,
};
initialState.activeUser = initialState.users[0];
//helper functon for updating messages/senders in convos
function updateMessageInConversations(state, updatedMessage) {
  const msgToEditLiveIndex = state.activeConversation.messages.findIndex(
    (msg) => msg._id === updatedMessage._id
  );
  if (msgToEditLiveIndex !== -1) {
    state.activeConversation.messages[msgToEditLiveIndex] = updatedMessage;
  }

  const storedConvoIndex = state.conversations.findIndex(
    (convo) => convo._id === state.activeConversationId
  );
  if (storedConvoIndex !== -1) {
    const storedMsgToEditIndex = state.conversations[
      storedConvoIndex
    ].messages.findIndex((msg) => msg._id === updatedMessage._id);
    if (storedMsgToEditIndex !== -1) {
      state.conversations[storedConvoIndex].messages[storedMsgToEditIndex] =
        updatedMessage;
    }
  }
}

export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/v1/conversations/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      return response.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchActiveConvo = createAsyncThunk(
  "messages/fetchActiveConvo",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${apiUrl}/api/v1/conversations/setActive/`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      return response.data.activeConvo;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/conversations/${conversationId}/messages`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createConversation = createAsyncThunk(
  "messages/createConversation",
  async ({ participants }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${apiUrl}/api/v1/conversations/`,
        { participants },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error in createConversation:", error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteConvo = createAsyncThunk(
  "messages/deleteConvo",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/v1/conversations`,
        {
          data: { conversationId },
        },
        { withCredentials: true }
      );
      return response.data.deletedConvo;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const setActiveConvo = createAsyncThunk(
  "messages/setActiveConvo",
  async ({ conversationId }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/conversations/setActive`,
        { conversationId },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createMessage = createAsyncThunk(
  "messages/createMessage",
  async ({ conversationId, messageObj }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/messages/`,
        { conversationId, messageObj },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );

      return response.data.messageData;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editMsg = createAsyncThunk(
  "messages/editMsg",

  async ({ msgId, newMsgData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/v1/messages/${msgId}`,
        {
          newMsgData: newMsgData,
        },
        { withCredentials: true }
      );
      return response.data.updatedMsg;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editSender = createAsyncThunk(
  "messages/editSender",
  async ({ msgId, newSenderData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/v1/messages/${msgId}/sender`,
        {
          newSenderData: newSenderData,
        },
        { withCredentials: true }
      );
      return response.data.updatedSender;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteMsg = createAsyncThunk(
  "messages/deleteMsg",
  async ({ msgId, conversationId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/v1/messages/${msgId}`,
        {
          data: { conversationId },
          withCredentials: true,
        }
      );
      return response.data.deletedMsg;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchParticipants = createAsyncThunk(
  "messages/fetchParticipants",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/conversations/${conversationId}/users`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const addUserToConvo = createAsyncThunk(
  "messages/addUserToConvo",
  async ({ conversationId, contact }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/v1/conversations`,
        {
          conversationId,
          contact,
        },
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteUserFromConvo = createAsyncThunk(
  "messages/deleteUserFromConvo",
  async ({ conversationId, participantId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/v1/conversations/${conversationId}/${participantId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const addEmojiReact = createAsyncThunk(
  "messages/addEmojiReact",
  async ({ msgId, emojiCode }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/messages/emoji/`,
        {
          msgId: msgId,
          emojiCode: emojiCode,
        },
        { withCredentials: true }
      );
      return response.data.msgToAddEmojiTo;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editGroupChatName = createAsyncThunk(
  "messages/editGroupChatName",
  async ({ conversationId, gcName }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/v1/conversations/${conversationId}`,
        {
          gcName: gcName,
        },
        { withCredentials: true }
      );
      return response.data.editGc.groupChatName;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editGroupChatPfp = createAsyncThunk(
  "messages/editGroupChatPfp",
  async ({ conversationId, gcPfp }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/v1/conversations/${conversationId}/pfp`,
        {
          gcPfp: gcPfp,
        },
        { withCredentials: true }
      );
      return response.data.editGcPfp.groupChatPfp;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//beginning of actual slice
const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    changeAddUserMode(state, action) {
      state.addUsersMode = action.payload;
    },
    setActiveConversation(state, action) {
      state.activeConversationId = action.payload;
      state.activeConversation = state.conversations.find(
        (convo) => convo.id === state.activeConversationId
      );
    },
    clearActiveConversation(state) {
      state.activeConversationId = null;
      state.activeConversation = null;
    },
    setActiveUser(state, action) {
      state.activeUser = action.payload;
    },
    updateActiveConvoUser(state, action) {
      const userToUpdate = action.payload;

      if (!userToUpdate || !userToUpdate._id) return;

      const userIndex = state.activeConversation.participants.findIndex(
        (user) => user._id === userToUpdate._id
      );
      if (userIndex !== -1) {
        state.activeConversation.participants[userIndex] = userToUpdate;
      }
    },
    sendMessage(state, action) {
      if (!state.activeConversation) return;
      const storedConvo = state.conversations.find(
        (convo) => convo.id === state.activeConversationId
      );
      const conversation = state.activeConversation;
      if (conversation) {
        const newMessage = {
          message: action.payload.message,
          messageId: action.payload.messageId,
          senderId: action.payload.senderId,
          senderName: action.payload.senderName,
          date: action.payload.date,
          time: action.payload.time,
          pfp: action.payload.pfp,
        };
        conversation.messages.push(newMessage);
        storedConvo.messages.push(newMessage);
      }
    },
    editMessage(state, action) {
      const msgToEdit = state.activeConversation.messages.find(
        (msg) => msg.messageId === action.payload.messageId
      );
      const storedConvo = state.conversations.find(
        (convo) => convo.id === state.activeConversationId
      );
      const storedMsgToEdit = storedConvo.messages.find(
        (msg) => msg.messageId === action.payload.messageId
      );
      storedMsgToEdit.message = action.payload.newContent;
      msgToEdit.message = action.payload.newContent;
    },
    setIsChangeSenderMode(state, action) {
      state.isChangeSenderMode = action.payload;
    },
    setNewSenderMsg(state, action) {
      state.newSenderMsg = action.payload;
    },
    deleteMessage(state, action) {
      const storedConvo = state.conversations.find(
        (convo) => convo.id === state.activeConversationId
      );
      storedConvo.messages = storedConvo.messages.filter(
        (msg) => msg.senderId !== action.payload
      );
      state.activeConversation.messages =
        state.activeConversation.messages.filter(
          (msg) => msg.senderId !== action.payload
        );
    },
    setTargetToEditId(state, action) {
      state.targetToEditId = action.payload;
    },
    setMsgById(state, action) {
      state.oneMessageById = state.activeConversation.messages.find(
        (msg) => msg._id === action.payload
      );
    },
  },
  //extrareducers
  //for async
  //database
  //actions
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state, action) => {
        state.convosLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.convosLoading = false;
        state.conversations = action.payload;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.push(action.payload);
      })
      .addCase(deleteConvo.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(
          (convo) => convo._id !== action.payload._id
        );
        state.activeConversation = null;
        state.activeConversationId = null;
      })
      .addCase(fetchActiveConvo.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeConversationId = action.payload.activeConversationId;
          state.activeConversation = state.conversations.find(
            (convo) => convo._id === state.activeConversationId
          );
        }
      })
      .addCase(setActiveConvo.fulfilled, (state, action) => {
        state.activeConversationId = action.payload.activeConversationId;
        state.activeConversation = state.conversations.find(
          (convo) => convo._id === state.activeConversationId
        );
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        const targetConvo = state.conversations.find(
          (convo) => convo._id === action.payload._id
        );
        if (targetConvo) {
          state.conversations.find(
            (convo) => convo._id === action.payload._id
          ).participants = state.conversations
            .find((convo) => convo._id === action.payload._id)
            .participants.slice(0, 1)
            .concat(action.payload.fullContacts);
          if (state.activeConversation) {
            state.activeConversation.participants =
              state.activeConversation.participants
                .slice(0, 1)
                .concat(action.payload.fullContacts);
          }
        }
      })
      .addCase(addUserToConvo.fulfilled, (state, action) => {
        const { conversationId, contact } = action.payload;
        const targetConvoIndex = state.conversations.findIndex(
          (convo) => convo._id === conversationId
        );

        if (targetConvoIndex !== -1) {
          state.conversations[targetConvoIndex].participants.push(contact);
          // Update activeConversation if it is the same as the updated conversation
          if (
            state.activeConversation &&
            state.activeConversation._id === conversationId
          ) {
            state.activeConversation.participants.push(contact);
          }
        }
      })
      .addCase(deleteUserFromConvo.fulfilled, (state, action) => {
        const convoInStateIndex = state.conversations.findIndex(
          (convo) => convo._id === action.payload.deletedFromConvo._id
        );
        //delete users from convos
        state.conversations[convoInStateIndex].participants =
          state.conversations[convoInStateIndex].participants.filter(
            (chatter) => chatter._id !== action.payload.participantId
          );
        state.activeConversation.participants =
          state.activeConversation.participants.filter(
            (chatter) => chatter._id !== action.payload.participantId
          );
        //delete messages from that user
        state.conversations[convoInStateIndex].messages = state.conversations[
          convoInStateIndex
        ].messages.filter(
          (msg) => !action.payload.messageIds.includes(msg._id)
        );
        state.activeConversation.messages =
          state.activeConversation.messages.filter(
            (msg) => !action.payload.messageIds.includes(msg._id)
          );
      })

      .addCase(fetchMessages.pending, (state, action) => {
        state.messagesLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.conversations.find(
          (convo) => convo._id === action.payload._id
        ).messages = action.payload.fullMessages;
        if (state.activeConversation) {
          state.activeConversation.messages = action.payload.fullMessages;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        const convoInStateIndex = state.conversations.findIndex(
          (convo) => convo._id === state.activeConversationId
        );
        state.activeConversation.messages.push(action.payload);
        if (convoInStateIndex !== -1) {
          state.conversations[convoInStateIndex].messages.push(action.payload);
        }
      })
      .addCase(editMsg.fulfilled, (state, action) => {
        updateMessageInConversations(state, action.payload);
      })
      .addCase(editSender.fulfilled, (state, action) => {
        updateMessageInConversations(state, action.payload);
      })
      .addCase(deleteMsg.fulfilled, (state, action) => {
        state.activeConversation.messages =
          state.activeConversation.messages.filter(
            (msg) => msg._id !== action.payload._id
          );
        const convoInStateIndex = state.conversations.findIndex(
          (convo) => convo._id === action.payload.conversationId
        );
        if (convoInStateIndex !== -1) {
          state.conversations[convoInStateIndex].messages = state.conversations[
            convoInStateIndex
          ].messages.filter((msg) => msg._id !== action.payload._id);
        }
        if (action.payload.imgInMsg) {
          const imgID = getCloudinaryImgId(action.payload.imgInMsg);
          deleteImgFromCloud(imgID);
        }
      })
      .addCase(addEmojiReact.fulfilled, (state, action) => {
        state.activeConversation.messages.find(
          (msg) => msg._id === action.payload._id
        ).emojiReact = action.payload.emojiReact;
      })
      .addCase(editGroupChatName.pending, (state, action) => {
        state.gcUpdating = true;
      })
      .addCase(editGroupChatName.fulfilled, (state, action) => {
        state.activeConversation.groupChatName = action.payload;
        state.gcUpdating = false;
      })
      .addCase(editGroupChatPfp.pending, (state, action) => {
        state.gcUpdating = true;
      })
      .addCase(editGroupChatPfp.fulfilled, (state, action) => {
        state.activeConversation.groupChatPfp = action.payload;
        state.gcUpdating = false;
      });
  },
});
export const {
  startNewConversation,
  setActiveConversation,
  clearActiveConversation,
  sendMessage,
  setActiveUser,
  updateActiveConvoUser,
  changeAddUserMode,
  deleteMessage,
  setTargetToEditId,
  deleteConversation,
  editMessage,
  setIsChangeSenderMode,
  setNewSenderMsg,
  setMsgById,
} = messagesSlice.actions;
export default messagesSlice.reducer;
