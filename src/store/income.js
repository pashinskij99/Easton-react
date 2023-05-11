import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: null,
  income: [],
};

const isLoading = (action) => {
  return ["income/pending"].includes(action.type);
};

const isFinishLoading = (action) => {
  return ["income/fulfilled", "income/rejected"].includes(action.type);
};

const isRejected = (action) => {
  return ["income/rejected"].includes(action.type);
};

export const getIncome = createAsyncThunk(
  "income",
  async (values, { rejectWithValue }) => {
    try {
      return values.income;
    } catch (e) {
      return rejectWithValue(e.response);
    }
  }
);

export const incomeSlice = createSlice({
  name: "income",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getIncome.fulfilled, (state, action) => {
        state.income = action.payload;
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

export default incomeSlice.reducer;
