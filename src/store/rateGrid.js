import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import qs from 'qs';

const currFormat = (val) => {
  if (typeof val !== 'string') {
    val = String(val);
  }
  return `$` + val.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  const currParse = (val) => {
    if (typeof val !== 'string') {
      val = String(val);
    }
    return val.replace(/^\$/, '');
  }
  const percentFormat = (val) => val.toLocaleString(undefined, { maximumFractionDigits: 4 })+'%'
  const percentParse = (val) => {
    if (typeof val !== 'string') {
      val = String(val);
    }
    return val.replace(/\%/, '');
  }
  


const initialState = {
  isLoading: false,
  rateGrid: [],
  error: null,
};

const isLoading = (action) => {
  return ["rateGrid/pending"].includes(action.type);
};

const isFinishLoading = (action) => {
  return ["rateGrid/fulfilled", "rateGrid/rejected"].includes(action.type);
};

const isRejected = (action) => {
  return ["rateGrid/rejected"].includes(action.type);
};

export const getRateGridDetails = createAsyncThunk(
  "rateGrid",
  async (values, { rejectWithValue }) => {
    try {
      const url = `http://eastontj.ddns.net:7000/lcalc/?ltv=${values.ltv}&score=${values.score}&amt=${values.amt}`;
      const { data } = await axios.get(url);
      console.log("rategrid : ", data)
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

export const rateGridSlice = createSlice({
  name: "rateGrid",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getRateGridDetails.fulfilled, (state, action) => {
        state.rateGrid = action.payload;
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

export const getDealers = createAsyncThunk(
  "rateGridDealerEmails",
  async (values, { rejectWithValue }) => {
    try {
      const url = `http://eastontj.ddns.net:7000/getDealers`;
      const { data } = await axios.get(url);
      console.log("dealers : ", data)
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

export const sendRateSheet = createAsyncThunk(
  "rateGrid",
  async (payload, { rejectWithValue }) => {
      const url = `http://eastontj.ddns.net:7000/sendrs`;

      // Convert JSON object to x-www-form-urlencoded
      const urlEncodedData = qs.stringify(JSON.parse(payload));

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://eastontj.ddns.net:7000/sendrs',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : urlEncodedData
      };

      return axios.request(config)
      .then((response) => {
        console.log("axios call:", config)
        return "Sent";
      })
      .catch((error) => {
        console.log(error);
        return rejectWithValue(error.response);
      });
    }
);

export default rateGridSlice.reducer;
