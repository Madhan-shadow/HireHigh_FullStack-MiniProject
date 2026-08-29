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

// ----------------------------------------------------
// GET ALL APPLICATIONS
// ----------------------------------------------------

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
        err.response?.data?.message ||
          'Failed to load applications.'
      );
    }
  }
);

// ----------------------------------------------------
// GET MY APPLICATIONS
// ----------------------------------------------------

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
        err.response?.data?.message ||
          'Failed to load your applications.'
      );
    }
  }
);

// ----------------------------------------------------
// CREATE APPLICATION
// ----------------------------------------------------

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',

  async (jobId, { rejectWithValue }) => {
    try {
      const data = await applicationService.apply(jobId);

      return data;
    } catch (err) {
      const status = err.response?.status;

      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        '';

      /*
       * T23
       *
       * Backend may return HTTP 409 for capacity/domain conflict.
       */

      if (
        status === 409 ||
        /capacity/i.test(String(serverMessage)) ||
        /exceed/i.test(String(serverMessage)) ||
        /full/i.test(String(serverMessage))
      ) {
        return rejectWithValue({
          conflict: true,
          message: 'Application capacity exceeded',
        });
      }

      return rejectWithValue({
        conflict: false,
        message:
          serverMessage ||
          'Failed to submit application.',
      });
    }
  }
);

// ----------------------------------------------------
// UPDATE APPLICATION STAGE
// ----------------------------------------------------

export const updateStage = createAsyncThunk(
  'applications/updateStage',

  async ({ id, stage }, { rejectWithValue }) => {
    try {
      const data =
        await applicationService.updateStage(id, stage);

      return {
        id,
        stage,
        data,
      };
    } catch (err) {
      return rejectWithValue({
        id,
        message:
          err.response?.data?.message ||
          'Failed to update stage.',
      });
    }
  }
);

// ----------------------------------------------------
// DELETE APPLICATION
// ----------------------------------------------------

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
        err.response?.data?.message ||
          'Failed to delete application.'
      );
    }
  }
);

// ----------------------------------------------------
// HELPER FOR APPLICATION ERROR
// ----------------------------------------------------

const applyWarningOrError = (
  state,
  payload,
  fallback
) => {
  state.warningMessage = null;

  if (payload && typeof payload === 'object') {
    if (payload.conflict) {
      state.warningMessage =
        payload.message ||
        'Application capacity exceeded';

      state.error = null;
      return;
    }

    state.error =
      payload.message ||
      fallback;

    return;
  }

  const message = String(payload || '');

  /*
   * Capacity/domain related errors should appear
   * as warnings instead of normal errors.
   */

  if (
    /capacity/i.test(message) ||
    /exceed/i.test(message) ||
    /full/i.test(message) ||
    /already applied/i.test(message) ||
    /duplicate/i.test(message)
  ) {
    state.warningMessage =
      'Application capacity exceeded';

    state.error = null;
    return;
  }

  state.error =
    message ||
    fallback;
};

// ----------------------------------------------------
// SLICE
// ----------------------------------------------------

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

      // ============================================
      // FETCH APPLICATIONS
      // ============================================

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

          const payload = action.payload || {};

          /*
           * Spring Boot Page response
           */

          state.items =
            payload.content ||
            payload.items ||
            [];

          state.totalPages =
            payload.totalPages ??
            0;

          state.totalElements =
            payload.totalElements ??
            0;

          state.currentPage =
            payload.number ??
            0;

          state.size =
            payload.size ??
            state.size;
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

      // ============================================
      // MY APPLICATIONS
      // ============================================

      .addCase(
        fetchMyApplications.fulfilled,
        (state, action) => {
          state.myApplications =
            action.payload || [];
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

      // ============================================
      // T21 - APPLICATION CREATED SUCCESS
      // ============================================

      .addCase(
        applyToJob.fulfilled,
        (state, action) => {
          state.error = null;
          state.warningMessage = null;

          const response =
            action.payload || {};

          /*
           * Use backend message if available.
           * Otherwise use the standard success message.
           */

          state.successMessage =
            response.message ||
            response.successMessage ||
            'Application submitted successfully.';
        }
      )

      // ============================================
      // T23 - CAPACITY EXCEEDED WARNING
      // ============================================

      .addCase(
        applyToJob.rejected,
        (state, action) => {
          applyWarningOrError(
            state,
            action.payload,
            'Failed to submit application.'
          );
        }
      )

      // ============================================
      // UPDATE STAGE
      // ============================================

      .addCase(
        updateStage.pending,
        (state, action) => {
          const { id, stage } =
            action.meta.arg;

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
        (state) => {
          state.successMessage =
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

      // ============================================
      // DELETE
      // ============================================

      .addCase(
        deleteApplication.fulfilled,
        (state, action) => {
          state.items =
            state.items.filter(
              (application) =>
                application.id !==
                action.payload.id
            );

          state.successMessage =
            action.payload.data?.message ||
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

