import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobService from '../../services/jobService';

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
  async (jobData, { rejectWithValue }) => {
    try {
      return await jobService.create(jobData);
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Failed to create job.'));
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      return await jobService.update(id, jobData);
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Failed to update job.'));
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { rejectWithValue }) => {
    try {
      await jobService.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Failed to delete job.'));
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