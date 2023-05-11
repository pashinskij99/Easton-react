import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const qs = require("qs");

const initialState = {
  isLoading: false,
  htmlContent: "",
};

const isLoading = (action) => {
  return ["popupDetails/pending"].includes(action.type);
};

const isFinishLoading = (action) => {
  return ["popupDetails/fulfilled", "popupDetails/rejected"].includes(
    action.type
  );
};

const isRejected = (action) => {
  return ["popupDetails/rejected"].includes(action.type);
};

export const getPopupDetails = createAsyncThunk(
  "popupDetails",
  async (values, { rejectWithValue }) => {
    try {
      let dataSet = qs.stringify({
        submission_id: "{D6C5A36F-680F-A414-8C4A-75F1120850A5}",
        borrtype: "primary",
      });

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://eastontj.ddns.net:7000/credhtml",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: dataSet,
      };
      const { data } = await axios.request(config);

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

export const popupDetailsSlice = createSlice({
  name: "popupDetails",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getPopupDetails.fulfilled, (state, action) => {
        state.htmlContent = action.payload;
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

export default popupDetailsSlice.reducer;
