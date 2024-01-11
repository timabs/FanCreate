import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import dayjs from "dayjs";
const apiUrl = "https://fancreate-backend.onrender.com";
const format = "h:mm A";
const initialState = {
  youBubbleColor: "#00e34d",
  backgroundImg: "",
  opacity: 1,
  imgIsUploading: false,
  emoji: "",
  isEmojiPickerOpen: false,
  batteryLevel: 100,
  time: dayjs().format(format),
  wifi: 3,
  cellSignal: 5,
  detailsUpdating: false,
};

export const updateSysDetails = createAsyncThunk(
  "chat/updateSysDetails",
  async ({ conversationId }, thunkAPI) => {
    try {
      const currentState = thunkAPI.getState();
      const batteryState = currentState.chat.batteryLevel;
      const timeState = currentState.chat.time;
      const wifiState = currentState.chat.wifi;
      const cellState = currentState.chat.cellSignal;
      const sysDetailsObj = {
        batteryLevel: batteryState,
        time: timeState,
        wifi: wifiState,
        cellSignal: cellState,
      };
      const response = await axios.patch(
        `${apiUrl}/api/v1/conversations/${conversationId}/sys-details`,
        { conversationId: conversationId, sysDetails: sysDetailsObj }
      );
      return response.data;
    } catch (error) {
      console.error("Error in updateSysDetails:", error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setYouBubbleColor(state, action) {
      state.youBubbleColor = action.payload;
    },
    setBackgroundImg(state, action) {
      state.backgroundImg = action.payload;
      console.log("bg img changed");
    },
    setOpacity(state, action) {
      state.opacity = action.payload;
    },
    setIsUploading(state, action) {
      state.imgIsUploading = action.payload;
    },
    setEmoji(state, action) {
      state.emoji = action.payload;
    },
    setEmojiPickerOpen(state, action) {
      state.isEmojiPickerOpen = action.payload;
    },
    setBatteryLevel(state, action) {
      state.batteryLevel = action.payload;
    },
    setTime(state, action) {
      if (action.payload === "") {
        state.time = dayjs().format(format);
      } else {
        state.time = action.payload;
      }
    },
    setWifi(state, action) {
      state.wifi = action.payload;
    },
    setCellSignal(state, action) {
      state.cellSignal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateSysDetails.pending, (state) => {
        state.detailsUpdating = true;
      })
      .addCase(updateSysDetails.fulfilled, (state) => {
        state.detailsUpdating = false;
      });
  },
});
export const {
  setYouBubbleColor,
  setBackgroundImg,
  setOpacity,
  setIsUploading,
  setEmoji,
  setEmojiPickerOpen,
  setBatteryLevel,
  setTime,
  setWifi,
  setCellSignal,
} = chatSlice.actions;
export default chatSlice.reducer;
