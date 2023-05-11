import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices";

export default configureStore({
  reducer: {
    user: userSlice,
  },
});
