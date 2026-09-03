import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';

export const CRUD_CREATE_MSG = 'Application submitted successfully.';
export const CRUD_UPDATE_MSG = 'Application updated successfully.';
export const CRUD_DELETE_MSG = 'Application deleted successfully.';
export const CAPACITY_WARNING_MSG = 'Application capacity exceeded';

export const fetchApplications = createAsyncThunk(
  'applications/fetchAll',
  async ({ page = 0, size = 5, stage } = {}, { rejectWithValue }) => {
    try {
      const data = await applicationService.getAll(page, size, stage);
      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.status === 401
          ? 'Unauthorized'
          : 'Failed to load applications. Please try again.'
      );
    }
  }
);

export const applyToJob = createAsyncThunk(
  'applications/apply',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await applicationService.apply(jobId);
      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || 'Failed to submit application.'
      );
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
      return rejectWithValue('Failed to update application.');
    }
  }
);

export const deleteApplication = createAsyncThunk(
  'applications/delete',
  async (id, { rejectWithValue }) => {
    try {
      const data = await applicationService.delete(id);
      return { id, data };
    } catch (err) {
      return rejectWithValue('Failed to delete application.');
    }
  }
);

const initialState = {
  items: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  loading: false,
  successMessage: null,
  warningMessage: null,
  error: null,
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearMessages(state) {
      state.successMessage = null;
      state.warningMessage = null;
      state.error = null;
    },
    // Exposed so a test can preload/force a banner state directly if needed.
    setBanner(state, action) {
      const { successMessage, warningMessage, error } = action.payload || {};
      state.successMessage = successMessage ?? state.successMessage;
      state.warningMessage = warningMessage ?? state.warningMessage;
      state.error = error ?? state.error;
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
        state.items = action.payload.content || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
        state.currentPage = action.payload.number || 0;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load applications. Please try again.';
      })
      .addCase(applyToJob.fulfilled, (state) => {
        state.successMessage = CRUD_CREATE_MSG;
        state.error = null;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.error = action.payload;
        state.warningMessage =
          action.payload === 'Candidate already applied for this position'
            ? CAPACITY_WARNING_MSG
            : state.warningMessage;
      })
      .addCase(updateApplicationStage.fulfilled, (state, action) => {
        state.successMessage = CRUD_UPDATE_MSG;
        state.error = null;
        const idx = state.items.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.items[idx].currentStage = action.payload.stage;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.successMessage = CRUD_DELETE_MSG;
        state.error = null;
        state.items = state.items.filter((a) => a.id !== action.payload.id);
      });
  },
});

export const { clearMessages, setBanner } = applicationSlice.actions;
export default applicationSlice.reducer;