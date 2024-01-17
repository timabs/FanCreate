import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = "https://fancreate-backend.onrender.com";
const initialState = {
  contactsArr: [],
  contactToEdit: null,
  recentlyEditedContactId: null,
  isTextersVisible: false,
};
export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/v1/contacts/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      return response.data.contacts;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createContact = createAsyncThunk(
  "contacts/createContact",
  async ({ contact }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${apiUrl}/api/v1/contacts/`,
        { contact },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      return response.data.contactData;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editContact = createAsyncThunk(
  "contacts/editContact",
  async ({ contactToEdit, newContactData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${apiUrl}/api/v1/contacts/`,
        { contactToEdit, newContactData },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async ({ contactId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/contacts/delete`,
        {
          contactId: contactId,
        },
        { withCredentials: true }
      );
      return response.data.deletedContact;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    addToContacts: (state, action) => {
      state.contactsArr.push(action.payload);
    },
    // deleteContact: (state, action) => {
    //   state.contactsArr = state.contactsArr.filter(
    //     (contact) => contact.id !== action.payload.id
    //   );
    // },
    setUsersVisible: (state, action) => {
      state.isTextersVisible = action.payload || !state.isTextersVisible;
    },
    setContactToEdit: (state, action) => {
      state.contactToEdit = action.payload;
    },
    clearContactToEdit: (state) => {
      state.contactToEdit = null;
    },
    // editContact: (state, action) => {
    //   const index = state.contactsArr.findIndex(
    //     (contact) => contact.id === action.payload._id
    //   );
    //   if (index !== -1) {
    //     state.contactsArr[index] = action.payload;
    //     state.recentlyEditedContactId = action.payload._id;
    //   }
    // },
    clearRecentlyEdited: (state) => {
      state.recentlyEditedContactId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contactsArr = action.payload;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.contactsArr.push(action.payload);
      })
      .addCase(editContact.fulfilled, (state, action) => {
        const index = state.contactsArr.findIndex(
          (contact) => contact._id === action.payload._id
        );
        if (index !== -1) {
          state.contactsArr[index] = action.payload;
          state.recentlyEditedContactId = action.payload._id;
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        console.log(action.payload);
        state.contactsArr = state.contactsArr.filter(
          (contact) => contact._id !== action.payload._id
        );
      });
  },
});
export const {
  addToContacts,
  setContactToEdit,
  clearContactToEdit,
  clearRecentlyEdited,
  setUsersVisible,
} = contactsSlice.actions;
export default contactsSlice.reducer;
