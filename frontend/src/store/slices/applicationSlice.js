import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';

export const applyToJob = createAsyncThunk(
  'applications/apply',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await applicationService.apply(jobId);
      return data;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message,
      });
    }
  }
);

export const fetchApplications = createAsyncThunk(
  'applications/fetchAll',
  async ({ page = 0, size = 5, stage } = {}, { rejectWithValue }) => {
    try {
      const data = await applicationService.getAll(page, size, stage);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const fetchApplicationById = createAsyncThunk(
  'applications/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await applicationService.getById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const data = await applicationService.getMyApplications();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateApplicationStage = createAsyncThunk(
  'applications/updateStage',
  async ({ id, stage }, { rejectWithValue }) => {
    try {
      const data = await applicationService.updateStage(id, stage);
      return { id, stage, data };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteApplication = createAsyncThunk(
  'applications/delete',
  async (id, { rejectWithValue }) => {
    try {
      const data = await applicationService.deleteApplication(id);
      return { id, data };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const initialState = {
  items: [],
  myApplications: [],
  selectedApplication: null,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  status: 'idle',
  successMessage: null,
  warningMessage: null,
  errorMessage: null,
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearMessages(state) {
      state.successMessage = null;
      state.warningMessage = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyToJob.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage =
          action.payload?.message || 'Application submitted successfully.';
        state.warningMessage = null;
        state.errorMessage = null;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.status = 'failed';
        const status = action.payload?.status;
        if (status === 409) {
          state.warningMessage = 'Application capacity exceeded';
          state.errorMessage = null;
        } else if (status === 401) {
          // handled globally by api.js interceptor
        } else if (status >= 500) {
          state.errorMessage = 'Internal server error';
        } else {
          state.errorMessage = action.payload?.message || 'Something went wrong';
        }
      })

      .addCase(fetchApplications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        const payload = action.payload || {};
        state.status = 'succeeded';
        state.items = payload.content || [];
        state.totalPages = payload.totalPages ?? 0;
        state.totalElements = payload.totalElements ?? 0;
        state.currentPage = payload.number ?? 0;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload?.message || 'Internal server error';
      })

      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.selectedApplication = action.payload || null;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.errorMessage = action.payload?.message || 'Application not found';
      })

      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.myApplications = action.payload || [];
      })

      .addCase(updateApplicationStage.fulfilled, (state, action) => {
        const { id, stage, data } = action.payload || {};
        const app = state.items.find((a) => a.id === id);
        if (app) app.currentStage = stage;
        state.successMessage = data?.message || 'Application updated successfully.';
        state.warningMessage = null;
        state.errorMessage = null;
      })
      .addCase(updateApplicationStage.rejected, (state, action) => {
        state.errorMessage = action.payload?.message || 'Internal server error';
      })

      .addCase(deleteApplication.fulfilled, (state, action) => {
        const { id, data } = action.payload || {};
        state.items = state.items.filter((a) => a.id !== id);
        state.successMessage = data?.message || 'Application deleted successfully.';
        state.warningMessage = null;
        state.errorMessage = null;
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.errorMessage = action.payload?.message || 'Internal server error';
      });
  },
});

export const { clearMessages } = applicationSlice.actions;
export default applicationSlice.reducer;