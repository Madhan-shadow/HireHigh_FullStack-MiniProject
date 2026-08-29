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

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};

// Safely extract a string message from any axios error shape
const extractErrorMessage = (err) => {
  const data = err.response?.data;

  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    return data.message || data.error || '';
  }
  return err.message || '';
};

// ======================================================
// GET ALL APPLICATIONS
// ======================================================

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async ({ page = 0, size = 5, stage } = {}, { rejectWithValue }) => {
    try {
      return await applicationService.getAll(page, size, stage);
    } catch (err) {
      if (err.response?.status === 401) {
        clearSession();
      }
      return rejectWithValue(extractErrorMessage(err) || 'Failed to load applications.');
    }
  }
);

// ======================================================
// GET MY APPLICATIONS
// ======================================================

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      return await applicationService.getMyApplications();
    } catch (err) {
      if (err.response?.status === 401) {
        clearSession();
      }
      return rejectWithValue(extractErrorMessage(err) || 'Failed to load your applications.');
    }
  }
);

// ======================================================
// CREATE / APPLY TO JOB (T21, T23)
// ======================================================

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await applicationService.apply(jobId);
      return data;
    } catch (err) {
      const status = err.response?.status;
      const message = extractErrorMessage(err);

      const isCapacityIssue =
        status === 409 ||
        /capacity/i.test(message) ||
        /exceed/i.test(message) ||
        /full/i.test(message) ||
        /already applied/i.test(message);

      if (isCapacityIssue) {
        return rejectWithValue({
          conflict: true,
          message: message || 'Application capacity exceeded',
        });
      }

      return rejectWithValue({
        conflict: false,
        message: message || 'Failed to submit application.',
      });
    }
  }
);

// ======================================================
// UPDATE APPLICATION STAGE
// ======================================================

export const updateStage = createAsyncThunk(
  'applications/updateStage',
  async ({ id, stage }, { rejectWithValue }) => {
    try {
      const data = await applicationService.updateStage(id, stage);
      return { id, stage, data };
    } catch (err) {
      return rejectWithValue({
        id,
        message: extractErrorMessage(err) || 'Failed to update stage.',
      });
    }
  }
);

// ======================================================
// DELETE APPLICATION
// ======================================================

export const deleteApplication = createAsyncThunk(
  'applications/deleteApplication',
  async (id, { rejectWithValue }) => {
    try {
      const data = await applicationService.delete(id);
      return { id, data };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err) || 'Failed to delete application.');
    }
  }
);

// ======================================================
// SLICE
// ======================================================

const applicationSlice = createSlice({
  name: 'applications',
  initialState,

  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearMessages: (state) => {
      state.successMessage = null;
      state.warningMessage = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ================= GET ALL =================
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.items = payload.content || payload.items || [];
        state.totalPages = payload.totalPages ?? 0;
        state.totalElements = payload.totalElements ?? 0;
        state.currentPage = payload.number ?? 0;
        state.size = payload.size ?? state.size;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load applications.';
      })

      // ================= MY APPLICATIONS =================
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        const payload = action.payload;
        state.myApplications = payload?.content || payload?.items || payload || [];
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.error = action.payload || 'Failed to load your applications.';
      })

      // ================= T21: CREATE SUCCESS =================
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.error = null;
        state.warningMessage = null;

        const response = action.payload || {};

        state.successMessage =
          response.message ||
          response.successMessage ||
          response.data?.message ||
          'Application submitted successfully.';
      })

      // ================= T23: CAPACITY WARNING =================
      .addCase(applyToJob.rejected, (state, action) => {
        state.successMessage = null;
        const payload = action.payload;

        if (payload && typeof payload === 'object' && payload.conflict) {
          state.warningMessage = payload.message || 'Application capacity exceeded';
          state.error = null;
          return;
        }

        const message = typeof payload === 'string' ? payload : payload?.message || '';

        if (/capacity/i.test(message) || /exceed/i.test(message) || /full/i.test(message)) {
          state.warningMessage = message || 'Application capacity exceeded';
          state.error = null;
          return;
        }

        state.error = message || 'Failed to submit application.';
      })

      // ================= UPDATE =================
      .addCase(updateStage.pending, (state, action) => {
        const { id, stage } = action.meta.arg;
        const item = state.items.find((application) => application.id === id);
        if (item) {
          item.currentStage = stage;
        }
      })
      .addCase(updateStage.fulfilled, (state, action) => {
        state.error = null;
        state.warningMessage = null;
        state.successMessage = action.payload?.data?.message || 'Application updated successfully.';
      })
      .addCase(updateStage.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to update stage.';
      })

      // ================= DELETE =================
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((application) => application.id !== action.payload.id);
        state.error = null;
        state.warningMessage = null;
        state.successMessage = action.payload.data?.message || 'Application deleted successfully.';
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete application.';
      });
  },
});

export const { setSearchQuery, clearMessages } = applicationSlice.actions;

export default applicationSlice.reducer;