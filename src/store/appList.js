import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  appList: [],
  error: null,
};

const isLoading = (action) => {
  return ["appList/pending"].includes(action.type);
};

const isFinishLoading = (action) => {
  return ["appList/fulfilled", "appList/rejected"].includes(action.type);
};

const isRejected = (action) => {
  return ["loan/appList/rejected"].includes(action.type);
};

export const getAppList = createAsyncThunk(
  "appList",
  async (values, { rejectWithValue }) => {
    try {
      const url = "http://eastontj.ddns.net:7000/allapps";
      const { data } = await axios.get(url);
      if (data === "Error") {
        return rejectWithValue("Loading Error!");
      } else {
        return data;
      }
    } catch (e) {
      return rejectWithValue(e.response);
    }
  }
);

export const appListSlice = createSlice({
  name: "appList",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAppList.fulfilled, (state, action) => {
        state.appList = action.payload;
        state.error = null;
      })
      .addMatcher(isLoading, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.error = action.payload;
      })
      .addMatcher(isFinishLoading, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default appListSlice.reducer;
