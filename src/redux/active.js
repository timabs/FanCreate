import { createSlice } from "@reduxjs/toolkit";

const activeSlice = createSlice({
  name: "active",
  initialState: {
    activeScreen: null,
    activeTab: "chat",
  },
  reducers: {
    setActiveScreen(state, action) {
      state.activeScreen = action.payload;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveScreen, setActiveTab } = activeSlice.actions;
export default activeSlice.reducer;
