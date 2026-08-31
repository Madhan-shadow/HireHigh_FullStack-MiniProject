import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import interviewService from '../../services/interviewService';

export const fetchInterviews = createAsyncThunk(
  'interviews/fetchAll',
  async (interviewerId, { rejectWithValue }) => {
    try {
      return await interviewService.getByInterviewer(interviewerId);
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to load interviews');
    }
  }
);

export const recordFeedback = createAsyncThunk(
  'interviews/recordFeedback',
  async ({ id, feedback, rating }, { rejectWithValue }) => {
    try {
      return await interviewService.recordFeedback(id, feedback, rating);
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to save feedback');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const interviewSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(recordFeedback.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export default interviewSlice.reducer;