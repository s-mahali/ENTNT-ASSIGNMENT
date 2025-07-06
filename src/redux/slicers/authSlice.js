import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: false,
  isAdmin: false,
  users:[],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.status = true;
    },
    setStatus: (state) => {
      state.status = false;
    },
    setAdmin: (state) => {
      state.isAdmin = true;
    },
    
  },
});
export const { setAuthUser, setStatus, setAdmin } = authSlice.actions;
export default authSlice.reducer;
