import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import interviewService from '../../services/interviewService';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchInterviews = createAsyncThunk(
  'interviews/fetchInterviews',
  async (interviewerId, { rejectWithValue }) => {
    try {
      if (interviewerId) {
        return await interviewService.getByInterviewer(interviewerId);
      }
      return await interviewService.getAll();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load interviews.');
    }
  }
);

export const scheduleInterview = createAsyncThunk(
  'interviews/scheduleInterview',
  async (interviewData, { rejectWithValue }) => {
    try {
      return await interviewService.schedule(interviewData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to schedule interview.');
    }
  }
);

export const recordFeedback = createAsyncThunk(
  'interviews/recordFeedback',
  async ({ id, feedbackData }, { rejectWithValue }) => {
    try {
      return await interviewService.recordFeedback(id, feedbackData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to record feedback.');
    }
  }
);

const interviewSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {
    clearInterviewError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(scheduleInterview.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(recordFeedback.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { clearInterviewError } = interviewSlice.actions;
export default interviewSlice.reducer;