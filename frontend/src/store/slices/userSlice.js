import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  room: "",
  name: "",
};

const userSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
