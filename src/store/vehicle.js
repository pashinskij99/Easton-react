import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {vin_update, zip_update} from "../components/VehicleCard"

const qs = require("qs");

const initialState = {
  isLoading: false,
  vehicle: [],
  error: null,
};

const isLoading = (action) => {
  return ["vehicle/pending"].includes(action.type);
};

const isFinishLoading = (action) => {
  return ["vehicle/fulfilled", "vehicle/rejected"].includes(action.type);
};

const isRejected = (action) => {
  return ["vehicle/rejected"].includes(action.type);
};


  export const getVehicleDetails = createAsyncThunk(
    "vehicle",
    
    async (payload, { rejectWithValue }) => {
      try {

        let urlb = `http://eastontj.ddns.net:7000/pup/${payload.zip}/${payload.vin}`;
        let config = {
          method: "get",
          url: urlb,
        };
        console.log("get pup: ", urlb)
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

export const getVINDetails = createAsyncThunk(
  "vehicle",
  
  async (payload, { rejectWithValue }) => {
    try {

      let urlb = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${payload.vin}?format=json`;
      let config = {
        method: "get",
        url: urlb,
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

export const getVehicleDB = createAsyncThunk(
  "vehicle",
  
  async (payload, { rejectWithValue }) => {
    try {

      let urlb = `http://eastontj.ddns.net:7000/VehDB/`;
      let config = {
        method: "get",
        url: urlb,
      };
      const { data } = await axios.request(config);

      if (data === "Error") {
        return rejectWithValue("Loading Error!");
      } else {
        const filteredData = data.map(item => {
          console.log("data:", data)
          const newItem = { ...item };
          delete newItem.headers; // Remove the non-serializable headers property
          console.log("newitem:",newItem)
          return newItem;
        });

        return filteredData;
      }
    } catch (e) {
      return rejectWithValue(e.response);
    }
  }
);

export const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getVehicleDetails.fulfilled, (state, action) => {
        state.vehicle = action.payload;
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
      
export const selectVehicleData = (state) => state.vehicle.vehicle;
export const selectVehicleIsLoading = (state) => state.vehicle.isLoading;

export default vehicleSlice.reducer;
