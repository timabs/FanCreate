import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = "https://fancreate-backend.onrender.com";
const initialState = {
  isLoggedIn: false,
  username: "",
  authPending: false,
};
export const login = createAsyncThunk(
  "auth/login",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/auth/login`,
        formData,
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("token", response.data.token);
      return response.data.user.username;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/auth/register`,
        formData,
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("token", response.data.token);
      setLoggedIn(true);
      setUsername(response.data.user.username);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.authPending = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authPending = false;
        state.isLoggedIn = true;
        state.username = action.payload;
      })
      .addCase(signUp.pending, (state) => {
        state.authPending = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.authPending = false;
        state.isLoggedIn = true;
        state.username = action.payload;
      });
  },
});
export const { setLoggedIn, setUsername } = authSlice.actions;
export default authSlice.reducer;
