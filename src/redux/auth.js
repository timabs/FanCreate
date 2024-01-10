import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  username: "",
};
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
});
export const { setLoggedIn, setUsername } = authSlice.actions;
export default authSlice.reducer;
