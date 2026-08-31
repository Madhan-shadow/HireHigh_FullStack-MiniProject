import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';

const CAPACITY_WARNING_MSG = 'Application capacity exceeded';

export const fetchApplications = createAsyncThunk(
  'applications/fetchAll',
  async ({ page = 0, size = 5, stage } = {}, { rejectWithValue }) => {
    try {
      return await applicationService.getAll(page, size, stage);
    } catch (err) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message || err?.message || 'Failed to load applications';
      return rejectWithValue({ status, message });
    }
  }
);

export const applyToJob = createAsyncThunk(
  'applications/apply',
  async (jobId, { rejectWithValue }) => {
    try {
      return await applicationService.apply(jobId);
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err?.message || 'Failed to apply';
      return rejectWithValue({ status, message });
    }
  }
);

export const updateApplicationStage = createAsyncThunk(
  'applications/updateStage',
  async ({ id, stage }, { rejectWithValue }) => {
    try {
      const response = await applicationService.updateStage(id, stage);
      return { id, stage, response };
    } catch (err) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message || err?.message || 'Failed to update application';
      return rejectWithValue({ status, message });
    }
  }
);

export const deleteApplication = createAsyncThunk(
  'applications/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await applicationService.delete(id);
      return { id, response };
    } catch (err) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message || err?.message || 'Failed to delete application';
      return rejectWithValue({ status, message });
    }
  }
);

const initialState = {
  items: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 5,
  loading: false,
  successMessage: null,
  warningMessage: null,
  error: null,
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.warningMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.content || [];
        state.totalPages = action.payload?.totalPages ?? 0;
        state.totalElements = action.payload?.totalElements ?? 0;
        state.currentPage = action.payload?.number ?? 0;
        state.size = action.payload?.size ?? state.size;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        const status = action.payload?.status;
        if (status === 401) {
          return; // handled globally by api.js interceptor (redirect)
        }
        state.error = action.payload?.message || 'Failed to load applications';
      })

      .addCase(applyToJob.fulfilled, (state, action) => {
        state.successMessage = action.payload?.message || 'Application submitted successfully.';
      })
      .addCase(applyToJob.rejected, (state, action) => {
        const status = action.payload?.status;
        if (status === 409 || status === 403) {
          state.warningMessage = CAPACITY_WARNING_MSG;
        } else {
          state.error = action.payload?.message || 'Failed to apply';
        }
      })

      .addCase(updateApplicationStage.pending, (state, action) => {
        const { id, stage } = action.meta.arg;
        const item = state.items.find((a) => a.id === id);
        if (item) item.currentStage = stage;
      })
      .addCase(updateApplicationStage.fulfilled, (state, action) => {
        state.successMessage =
          action.payload?.response?.message || 'Application updated successfully.';
      })
      .addCase(updateApplicationStage.rejected, (state, action) => {
        const status = action.payload?.status;
        if (status === 409 || status === 403) {
          state.warningMessage = CAPACITY_WARNING_MSG;
        } else {
          state.error = action.payload?.message || 'Failed to update application';
        }
      })

      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload.id);
        state.successMessage =
          action.payload?.response?.message || 'Application deleted successfully.';
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to delete application';
      });
  },
});

export const { clearMessages } = applicationSlice.actions;
export default applicationSlice.reducer;