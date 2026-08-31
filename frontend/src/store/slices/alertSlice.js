import { createSlice, nanoid } from '@reduxjs/toolkit';

// A single global alert stack, per SRS: "Multiple alerts stack vertically
// with z-index" and "Alert auto-dismisses after 3000ms using setTimeout."
// Every thunk in the app (login, apply, update, delete) pushes here instead
// of each page owning its own success/error/warning state.
const alertSlice = createSlice({
  name: 'alerts',
  initialState: { items: [] },
  reducers: {
    addAlert: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(message, type = 'success') {
        return { payload: { id: nanoid(), type, message } };
      },
    },
    removeAlert(state, action) {
      state.items = state.items.filter((a) => a.id !== action.payload);
    },
  },
});

export const { addAlert, removeAlert } = alertSlice.actions;
export default alertSlice.reducer;