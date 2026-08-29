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

const extractErrorMessage = (err) => {
  const data = err.response?.data;

  if (typeof data === 'string') {
    return data;
  }

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
  async (
    { page = 0, size = 5, stage } = {},
    { rejectWithValue }
  ) => {
    try {
      return await applicationService.getAll(
        page,
        size,
        stage
      );
    } catch (err) {
      if (err.response?.status === 401) {
        clearSession();
      }

      return rejectWithValue(
        extractErrorMessage(err) ||
          'Failed to load applications.'
      );
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

      return rejectWithValue(
        extractErrorMessage(err) ||
          'Failed to load your applications.'
      );
    }
  }
);

// ======================================================
// APPLY TO JOB
// T21 + T23
// ======================================================

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',
  async (jobId, { rejectWithValue, getState }) => {
    try {
      const state = getState();

      const user = state.auth?.user;

      const username =
        user?.email ||
        user?.username ||
        localStorage.getItem('username') ||
        '';

      const data = await applicationService.apply(
        jobId,
        username
      );

      return data;
    } catch (err) {
      const status = err.response?.status;
      const message = extractErrorMessage(err);

      const isCapacityIssue =
        status === 409 ||
        /capacity/i.test(message) ||
        /exceed/i.test(message) ||
        /full/i.test(message);

      if (isCapacityIssue) {
        return rejectWithValue({
          conflict: true,
          message:
            message ||
            'Application capacity exceeded for this job',
        });
      }

      return rejectWithValue({
        conflict: false,
        message:
          message ||
          'Failed to submit application.',
      });
    }
  }
);

// ======================================================
// UPDATE APPLICATION STAGE
// ======================================================

export const updateStage = createAsyncThunk(
  'applications/updateStage',
  async (
    { id, stage },
    { rejectWithValue }
  ) => {
    try {
      const data =
        await applicationService.updateStage(
          id,
          stage
        );

      return {
        id,
        stage,
        data,
      };
    } catch (err) {
      return rejectWithValue({
        id,
        message:
          extractErrorMessage(err) ||
          'Failed to update stage.',
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
      const data =
        await applicationService.delete(id);

      return {
        id,
        data,
      };
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err) ||
          'Failed to delete application.'
      );
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

      // ==================================================
      // GET ALL APPLICATIONS
      // ==================================================

      .addCase(
        fetchApplications.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchApplications.fulfilled,
        (state, action) => {
          state.loading = false;

          const payload =
            action.payload || {};

          state.items =
            payload.content ||
            payload.items ||
            [];

          state.totalPages =
            payload.totalPages ?? 0;

          state.totalElements =
            payload.totalElements ?? 0;

          state.currentPage =
            payload.number ?? 0;

          state.size =
            payload.size ?? state.size;
        }
      )

      .addCase(
        fetchApplications.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            'Failed to load applications.';
        }
      )

      // ==================================================
      // MY APPLICATIONS
      // ==================================================

      .addCase(
        fetchMyApplications.fulfilled,
        (state, action) => {
          const payload =
            action.payload;

          state.myApplications =
            payload?.content ||
            payload?.items ||
            payload ||
            [];
        }
      )

      .addCase(
        fetchMyApplications.rejected,
        (state, action) => {
          state.error =
            action.payload ||
            'Failed to load your applications.';
        }
      )

      // ==================================================
      // APPLY - PENDING
      // ==================================================

      .addCase(
        applyToJob.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.successMessage = null;
          state.warningMessage = null;
        }
      )

      // ==================================================
      // T21 - APPLICATION SUCCESS
      // ==================================================

      .addCase(
        applyToJob.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;
          state.warningMessage = null;

          const response =
            action.payload || {};

          state.successMessage =
            response.message ||
            response.successMessage ||
            'Application Submitted Successfully';
        }
      )

      // ==================================================
      // T23 - CAPACITY WARNING
      // ==================================================

      .addCase(
        applyToJob.rejected,
        (state, action) => {
          state.loading = false;
          state.successMessage = null;

          const payload =
            action.payload || {};

          const message =
            typeof payload === 'string'
              ? payload
              : payload.message || '';

          if (
            payload.conflict ||
            /capacity/i.test(message) ||
            /exceed/i.test(message) ||
            /full/i.test(message)
          ) {
            state.warningMessage =
              message ||
              'Application capacity exceeded for this job';

            state.error = null;
          } else {
            state.warningMessage = null;

            state.error =
              message ||
              'Failed to submit application.';
          }
        }
      )

      // ==================================================
      // UPDATE STAGE
      // ==================================================

      .addCase(
        updateStage.pending,
        (state, action) => {
          const {
            id,
            stage,
          } = action.meta.arg;

          const item =
            state.items.find(
              (application) =>
                application.id === id
            );

          if (item) {
            item.currentStage = stage;
          }
        }
      )

      .addCase(
        updateStage.fulfilled,
        (state, action) => {
          state.error = null;
          state.warningMessage = null;

          state.successMessage =
            action.payload?.data?.message ||
            'Application updated successfully.';
        }
      )

      .addCase(
        updateStage.rejected,
        (state, action) => {
          state.error =
            action.payload?.message ||
            'Failed to update stage.';
        }
      )

      // ==================================================
      // DELETE
      // ==================================================

      .addCase(
        deleteApplication.fulfilled,
        (state, action) => {
          state.items =
            state.items.filter(
              (application) =>
                application.id !==
                action.payload.id
            );

          state.error = null;
          state.warningMessage = null;

          state.successMessage =
            action.payload?.data?.message ||
            'Application deleted successfully.';
        }
      )

      .addCase(
        deleteApplication.rejected,
        (state, action) => {
          state.error =
            action.payload ||
            'Failed to delete application.';
        }
      );
  },
});

export const {
  setSearchQuery,
  clearMessages,
} = applicationSlice.actions;

export default applicationSlice.reducer;