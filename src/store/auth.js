import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  getCurrentUserInfo,
} from "../plugins/firebase";
import { getUserId } from "../utils/cookie";

const initialState = {
  isLoading: false,
  user: null,
  error: null,
};

const isLoading = (action) => {
  return [
    "auth/login/pending",
    "user/getUserInfo/pending",
    "auth/signup/pending",
  ].includes(action.type);
};

const isFinishLoading = (action) => {
  return [
    "auth/login/fulfilled",
    "auth/login/rejected",
    "auth/signup/fulfilled",
    "auth/signup/rejected",
    "user/getUserInfo/fulfilled",
    "user/getUserInfo/rejected",
  ].includes(action.type);
};

const isRejected = (action) => {
  return [
    "auth/login/rejected",
    "auth/signup/rejected",
    "user/getUserInfo/rejected",
  ].includes(action.type);
};

export const login = createAsyncThunk(
  "auth/login",
  async (values, { rejectWithValue }) => {
    try {
      const res = await logInWithEmailAndPassword(
        values.email,
        values.password
      );
      if (res.success) {
        return {
          email: res.user.email,
          name: res.user.name,
          role: res.user.role,
        };
      }

      return rejectWithValue(res.err.message);
    } catch (e) {
      return rejectWithValue({ message: e.message });
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (values, { rejectWithValue }) => {
    try {
      const res = await registerWithEmailAndPassword(
        values.name,
        values.email,
        values.password,
        values.role
      );
      if (res.success) {
        return res.user;
      }

      return rejectWithValue(res.err.message);
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (values, { rejectWithValue }) => {
    try {
      const id = getUserId();
      const res = await getCurrentUserInfo(id);
      if (res.success) {
        return res.user;
      }

      return rejectWithValue(res.err.message);
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);
export const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addMatcher(isLoading, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addMatcher(isFinishLoading, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
