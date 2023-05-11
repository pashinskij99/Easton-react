import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  contract: [],
  error: null,
};

const isLoading = (action) => {
  return ["contract/pending"].includes(action.type);
};

const isFinishLoading = (action) => {
  return ["contract/fulfilled", "contract/rejected"].includes(action.type);
};

const isRejected = (action) => {
  return ["contract/rejected"].includes(action.type);
};

export const getContractDetails = createAsyncThunk(
  "contract",
  async (values, { rejectWithValue }) => {
    try {
      const url = `http://eastontj.ddns.net:7000/getdetail/${values.submissionid}`;
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

export const contractSlice = createSlice({
  name: "contract",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getContractDetails.fulfilled, (state, action) => {
        state.contract = action.payload;
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
      

export default contractSlice.reducer;
