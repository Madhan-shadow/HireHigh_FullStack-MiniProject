import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';

const CAPACITY_WARNING_MSG = 'Application capacity exceeded';

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};

// GET ALL
export const fetchApplications = createAsyncThunk(
  'applications/fetchAll',
  async ({ page = 0, size = 5, stage } = {}, { rejectWithValue }) => {
    try {
      return await applicationService.getAll(page, size, stage);
    } catch (err) {
      const status = err?.response?.status;

      if (status === 401) {
        clearSession();
      }

      return rejectWithValue({
        status,
        message:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Failed to load applications',
      });
    }
  }
);

// GET MY APPLICATIONS
export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      return await applicationService.getMyApplications();
    } catch (err) {
      const status = err?.response?.status;

      if (status === 401) {
        clearSession();
      }

      return rejectWithValue({
        status,
        message:
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load your applications',
      });
    }
  }
);

// CREATE APPLICATION
export const applyToJob = createAsyncThunk(
  'applications/apply',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await applicationService.apply(jobId);

      return response;
    } catch (err) {
      const status = err?.response?.status;

      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data ||
        err?.message ||
        '';

      const message = String(serverMessage);

      if (
        status === 409 ||
        /capacity/i.test(message) ||
        /exceed/i.test(message) ||
        /full/i.test(message)
      ) {
        return rejectWithValue({
          conflict: true,
          message: CAPACITY_WARNING_MSG,
        });
      }

      return rejectWithValue({
        conflict: false,
        message: message || 'Failed to submit application',
      });
    }
  }
);

// UPDATE STAGE
export const updateApplicationStage = createAsyncThunk(
  'applications/updateStage',
  async ({ id, stage }, { rejectWithValue }) => {
    try {
      const response = await applicationService.updateStage(id, stage);

      return {
        id,
        stage,
        response,
      };
    } catch (err) {
      const status = err?.response?.status;

      return rejectWithValue({
        status,
        message:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Failed to update application',
      });
    }
  }
);

// DELETE
export const deleteApplication = createAsyncThunk(
  'applications/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await applicationService.delete(id);

      return {
        id,
        response,
      };
    } catch (err) {
      return rejectWithValue({
        status: err?.response?.status,
        message:
          err?.response?.data?.message ||
          err?.message ||
          'Failed to delete application',
      });
    }
  }
);

const initialState = {
  items: [],
  myApplications: [],

  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 5,

  loading: false,
  error: null,

  successMessage: null,
  warningMessage: null,
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

      // ---------------- GET ALL ----------------

      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload;

        // Supports both Spring Page response and array response
        if (Array.isArray(data)) {
          state.items = data;
          state.totalPages = 1;
          state.totalElements = data.length;
          state.currentPage = 0;
        } else {
          state.items = data?.content || [];
          state.totalPages = data?.totalPages ?? 0;
          state.totalElements = data?.totalElements ?? 0;
          state.currentPage = data?.number ?? 0;
          state.size = data?.size ?? state.size;
        }
      })

      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;

        if (action.payload?.status === 401) {
          state.error = 'Session expired';
          return;
        }

        state.error =
          action.payload?.message ||
          'Failed to load applications';
      })

      // ---------------- CREATE ----------------

      .addCase(applyToJob.fulfilled, (state, action) => {
        state.successMessage =
          action.payload?.message ||
          'Application Submitted Successfully';

        state.warningMessage = null;
        state.error = null;
      })

      .addCase(applyToJob.rejected, (state, action) => {
        if (action.payload?.conflict) {
          state.warningMessage = CAPACITY_WARNING_MSG;
          state.successMessage = null;
          state.error = null;
        } else {
          state.error =
            action.payload?.message ||
            'Failed to submit application';
        }
      })

      // ---------------- UPDATE ----------------

      .addCase(updateApplicationStage.pending, (state, action) => {
        const { id, stage } = action.meta.arg;

        const item = state.items.find(
          (application) => application.id === id
        );

        if (item) {
          item.currentStage = stage;
        }
      })

      .addCase(updateApplicationStage.fulfilled, (state, action) => {
        state.successMessage =
          action.payload?.response?.message ||
          'Application updated successfully';

        state.warningMessage = null;
        state.error = null;
      })

      .addCase(updateApplicationStage.rejected, (state, action) => {
        state.error =
          action.payload?.message ||
          'Failed to update application';
      })

      // ---------------- DELETE ----------------

      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (application) =>
            application.id !== action.payload.id
        );

        state.successMessage =
          action.payload?.response?.message ||
          'Application deleted successfully';

        state.warningMessage = null;
        state.error = null;
      })

      .addCase(deleteApplication.rejected, (state, action) => {
        state.error =
          action.payload?.message ||
          'Failed to delete application';
      });
  },
});

export const { clearMessages } = applicationSlice.actions;

export default applicationSlice.reducer;