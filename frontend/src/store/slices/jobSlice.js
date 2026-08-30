import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobService from '../../services/jobService';

export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await jobService.getAll();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load jobs');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData, { rejectWithValue }) => {
    try {
      const data = await jobService.create(jobData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const data = await jobService.update(id, jobData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update job');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await jobService.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete job');
    }
  }
);

const initialState = {
  items: [],
  searchQuery: '',
  status: 'idle',
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(createJob.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.items.findIndex((j) => j.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteJob.fulfilled, (state, action) => {
        state.items = state.items.filter((j) => j.id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery } = jobSlice.actions;
export default jobSlice.reducer;