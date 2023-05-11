import { configureStore } from "@reduxjs/toolkit";

import auth from "./auth";
import rateGrid from "./rateGrid";
import borrower from "./borrower";
import appList from "./appList";
import income from "./income";
import popup from "./popup";
import vehicle from "./vehicle";
import contract from "./contract";

export default configureStore({
  reducer: {
    auth,
    rateGrid,
    appList,
    borrower,
    income,
    popup,
    vehicle,
    contract,
  },
});
