import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobService from '../../services/jobService';
import { addAlert } from './alertSlice';

const initialState = {
  items: [],
  searchQuery: '',
  loading: false,
  error: null,
};

const extractMessage = (payload, fallback) => {
  if (!payload) return fallback;
  if (typeof payload === 'string') return payload;
  if (payload.message) return payload.message;
  if (payload.response?.data?.message) return payload.response.data.message;
  return fallback;
};

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (_, { rejectWithValue }) => {
  try {
    return await jobService.getAll();
  } catch (err) {
    return rejectWithValue(extractMessage(err, 'Failed to load jobs.'));
  }
});

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { dispatch, rejectWithValue }) => {
    try {
      const data = await jobService.create(jobData);
      dispatch(addAlert('Job posted successfully.', 'success'));
      return data;
    } catch (err) {
      const message = extractMessage(err, 'Failed to create job.');
      dispatch(addAlert(message, 'error'));
      return rejectWithValue(message);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }, { dispatch, rejectWithValue }) => {
    try {
      const data = await jobService.update(id, jobData);
      dispatch(addAlert('Job updated successfully.', 'success'));
      return data;
    } catch (err) {
      const message = extractMessage(err, 'Failed to update job.');
      dispatch(addAlert(message, 'error'));
      return rejectWithValue(message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await jobService.delete(id);
      dispatch(addAlert('Job deleted successfully.', 'success'));
      return id;
    } catch (err) {
      const message = extractMessage(err, 'Failed to delete job.');
      dispatch(addAlert(message, 'error'));
      return rejectWithValue(message);
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.items.findIndex((j) => j.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.items = state.items.filter((j) => j.id !== action.payload);
      });
  },
});

export const { setSearchQuery } = jobSlice.actions;

export const selectFilteredJobs = (state) => {
  const { items, searchQuery } = state.jobs;
  if (!searchQuery) return items;
  const q = searchQuery.toLowerCase();
  return items.filter(
    (job) => job.title?.toLowerCase().includes(q) || job.department?.toLowerCase().includes(q)
  );
};

export default jobSlice.reducer;