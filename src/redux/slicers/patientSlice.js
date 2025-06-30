import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  patients: [],
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    setPatientUsers: (state, action) => {
      state.patients = action.payload;
    },
  },
});
export const { setPatientUsers } = patientSlice.actions;
export default patientSlice.reducer;
