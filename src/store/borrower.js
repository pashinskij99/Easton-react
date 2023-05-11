import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { cloneDeep } from "lodash";
import { borrowerData, coborrowerData, contractData, vehicleData, rategridData } from "../mock";

const initialState = {
  isLoading: false,
  error: null,
  all: [],
  borrower: [],
  coborrower: [],
  contract : [],
  vehicle : [],
  rategrid : [],
};

const isLoading = (action) => {
  return ["borrowerDetails/pending"].includes(action.type);
};

const isFinishLoading = (action) => {
  return ["borrowerDetails/fulfilled", "borrowerDetails/rejected"].includes(
    action.type
  );
};

const isRejected = (action) => {
  return ["borrowerDetails/rejected"].includes(action.type);
};

export const getBorrowerDetails = createAsyncThunk(
  "borrowerDetails",
  async (values, { rejectWithValue }) => {
    try {
      const url = `http://eastontj.ddns.net:7000/getdetail/${values.submission_id}`;
      const { data } = await axios.get(url);

      if (data === "Error") {
        return rejectWithValue("Loading Error!");
      } else {
console.log("RGData: ", data)
        return data;
      }
    } catch (e) {
      return rejectWithValue(e.response);
    }
  }
);

export const borrowerDetailsSlice = createSlice({
  name: "borrowerDetails",
  initialState,
  extraReducers: (builder) => {
    builder
    .addCase(getBorrowerDetails.fulfilled, (state, action) => {
      if (action.payload && action.payload[0]) {
        const BorrowerInfo = action.payload[0].borrower;
        const CoborrowerInfo = action.payload[0].coborrower;
        const ContractInfo = action.payload[0].contract;
        const VehicleInfo = action.payload[0].vehicle;
        const RategridInfo = action.payload[0].rategrid;

        const finalItems = cloneDeep(borrowerData);
        const keys = Object.keys(BorrowerInfo);
        keys.forEach((key) => {
          const targetItem = finalItems.find(
            (item) => item.label.toLowerCase() === key
          );
          if (targetItem) {
            targetItem.value = BorrowerInfo[key] || "";
          }
        });
    
        const finalCoItems = cloneDeep(coborrowerData);
        if (CoborrowerInfo) {
          const cobKeys = Object.keys(CoborrowerInfo);
          cobKeys.forEach((key) => {
            const targetItem = finalCoItems.find(
              (item) => item.label.toLowerCase() === key
            );
            if (targetItem) {
              targetItem.value = CoborrowerInfo[key] || "";
            }
          });
        }
    
        const finalConItems = cloneDeep(contractData);
        if (ContractInfo) {
          const conKeys = Object.keys(ContractInfo);
          conKeys.forEach((key) => {
            const targetItem = finalConItems.find(
              (item) => item.label.toLowerCase() === key
            );
            if (targetItem) {
              targetItem.value = ContractInfo[key] || "";
            }
          });
        }
                            
        const finalVehItems = cloneDeep(vehicleData);
        if (VehicleInfo) {
          const vehKeys = Object.keys(VehicleInfo);
          vehKeys.forEach((key) => {
            const targetItem = finalVehItems.find(
              (item) => item.label.toLowerCase() === key.toLowerCase()
            );
            if (targetItem) {
              targetItem.value = VehicleInfo[key] || "";
            }
          });
        };

        const finalRGItems = Array.isArray(rategridData) ? cloneDeep(rategridData) : [];
        if (RategridInfo) {
        const RGKeys = Object.keys(RategridInfo);
        RGKeys.forEach((key) => {
          const targetItem = finalRGItems.find(
            (item) => item.label.toLowerCase() === key
          );
          if (targetItem) {
            targetItem.value = RategridInfo[key] || "";
          }
        });
        };
        state.all = action.payload;
        state.borrower = finalItems;
        state.coborrower = finalCoItems;
        state.contract = finalConItems;
        state.vehicle = finalVehItems;
        state.rategrid = finalRGItems;
        state.error = null;
      }
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
      
export default borrowerDetailsSlice.reducer;
