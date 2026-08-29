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

// ---------------- FETCH ALL APPLICATIONS ----------------

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

// ---------------- FETCH MY APPLICATIONS ----------------

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

// ---------------- APPLY TO JOB ----------------

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
        '';

      const message = String(serverMessage);

      /*
       * T23
       * Application capacity exceeded should be
       * displayed as a warning.
       */
      if (
        status === 409 ||
        /capacity|exceeded|full|maximum|limit|already applied/i.test(
          message
        )
      ) {
        return rejectWithValue({
          conflict: true,
          message: 'Application capacity exceeded',
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

// ---------------- UPDATE STAGE ----------------

export const updateStage = createAsyncThunk(
  'applications/updateStage',

  async ({ id, stage }, { rejectWithValue }) => {
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
          err.response?.data?.message ||
          'Failed to update stage.',
      });
    }
  }
);

// ---------------- DELETE APPLICATION ----------------

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

// ---------------- SLICE ----------------

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
      // FETCH APPLICATIONS
      // ==================================================

      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchApplications.fulfilled,
        (state, action) => {
          state.loading = false;

          const {
            content,
            totalPages,
            totalElements,
            number,
            size,
          } = action.payload || {};

          state.items = content || [];
          state.totalPages = totalPages ?? 0;
          state.totalElements = totalElements ?? 0;
          state.currentPage = number ?? 0;
          state.size = size ?? state.size;
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
      // FETCH MY APPLICATIONS
      // ==================================================

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

      // ==================================================
      // T21 - APPLICATION CREATED SUCCESSFULLY
      // ==================================================

      .addCase(
        applyToJob.fulfilled,
        (state, action) => {
          state.error = null;
          state.warningMessage = null;

          state.successMessage =
            action.payload?.message ||
            'Application submitted successfully.';
        }
      )

      // ==================================================
      // T23 - APPLICATION CAPACITY EXCEEDED
      // ==================================================

      .addCase(
        applyToJob.rejected,
        (state, action) => {
          const payload = action.payload;

          state.successMessage = null;

          if (payload?.conflict) {
            state.warningMessage =
              payload.message ||
              'Application capacity exceeded';

            state.error = null;
          } else {
            state.warningMessage = null;

            state.error =
              payload?.message ||
              payload ||
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
          const { id, stage } =
            action.meta.arg;

          const item = state.items.find(
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

      // ==================================================
      // DELETE APPLICATION
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