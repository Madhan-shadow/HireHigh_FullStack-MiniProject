import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';

const initialState = {
  items: [],
  myApplications: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 5,
  searchQuery: '',
  loading: false,
  error: null,
  successMessage: null,
  warningMessage: null,
};

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async ({ page = 0, size = 5 } = {}, { rejectWithValue }) => {
    try {
      return await applicationService.getAll(page, size);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load applications.');
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      return await applicationService.getMyApplications();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load your applications.');
    }
  }
);

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await applicationService.apply(jobId);
      return data;
    } catch (err) {
      if (err.response && err.response.status === 409) {
        return rejectWithValue({ conflict: true, message: 'Application capacity exceeded' });
      }
      return rejectWithValue({
        conflict: false,
        message: err.response?.data?.message || 'Failed to submit application.',
      });
    }
  }
);

export const updateStage = createAsyncThunk(
  'applications/updateStage',
  async ({ id, stage }, { rejectWithValue }) => {
    try {
      const data = await applicationService.updateStage(id, stage);
      return { id, stage, data };
    } catch (err) {
      return rejectWithValue({ id, message: err.response?.data?.message || 'Failed to update stage.' });
    }
  }
);

export const deleteApplication = createAsyncThunk(
  'applications/deleteApplication',
  async (id, { rejectWithValue }) => {
    try {
      const data = await applicationService.delete(id);
      return { id, data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete application.');
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
      state.warningMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch pipeline (paginated)
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        const { content, totalPages, totalElements, number, size } = action.payload;
        state.items = content || [];
        state.totalPages = totalPages ?? 0;
        state.totalElements = totalElements ?? 0;
        state.currentPage = number ?? 0;
        state.size = size ?? state.size;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // my applications (candidate)
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.error = action.payload;
      })
      // apply
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.successMessage = action.payload?.message || 'Application submitted successfully.';
      })
      .addCase(applyToJob.rejected, (state, action) => {
        if (action.payload?.conflict) {
          state.warningMessage = action.payload.message;
        } else {
          state.error = action.payload?.message || 'Failed to submit application.';
        }
      })
      // update stage - optimistic update, finalized on fulfilled
      .addCase(updateStage.pending, (state, action) => {
        const { id, stage } = action.meta.arg;
        const item = state.items.find((a) => a.id === id);
        if (item) item.currentStage = stage;
      })
      .addCase(updateStage.fulfilled, (state) => {
        state.successMessage = 'Application updated successfully.';
      })
      .addCase(updateStage.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to update stage.';
      })
      // delete
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload.id);
        state.successMessage = action.payload.data?.message || 'Application deleted successfully.';
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, clearMessages } = applicationSlice.actions;
export default applicationSlice.reducer;