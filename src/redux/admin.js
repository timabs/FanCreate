import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const submitEmail = createAsyncThunk(
  "admin/submitEmail",
  async ({ formData }, { rejectWithValue }) => {
    try {
      await axios.post(`https://fancreate-backend.onrender.com/api/v1/form`, {
        formData: formData,
      });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    submitLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitEmail.pending, (state) => {
        state.submitLoading = true;
      })
      .addCase(submitEmail.fulfilled, (state) => {
        state.submitLoading = false;
      });
  },
});

export const {} = adminSlice.actions;
export default adminSlice.reducer;
