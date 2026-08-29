import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';

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

const extractErrorMessage = (error) => {
  const data = error.response?.data;

  if (typeof data === 'string') {
    return data;
  }

  if (data && typeof data === 'object') {
    return (
      data.message ||
      data.error ||
      ''
    );
  }

  return error.message || '';
};

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
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error) ||
        'Failed to load applications.'
      );
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      return await applicationService.getMyApplications();
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error) ||
        'Failed to load your applications.'
      );
    }
  }
);

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',

  async (jobId, { rejectWithValue }) => {
    try {
      const response =
        await applicationService.apply(jobId);

      return response;
    } catch (error) {
      const message =
        extractErrorMessage(error);

      const status =
        error.response?.status;

      const capacityError =
        status === 409 ||
        /capacity/i.test(message) ||
        /exceed/i.test(message) ||
        /full/i.test(message);

      if (capacityError) {
        return rejectWithValue({
          conflict: true,
          message:
            message ||
            'Application capacity exceeded',
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

export const updateStage = createAsyncThunk(
  'applications/updateStage',

  async (
    { id, stage },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await applicationService.updateStage(
          id,
          stage
        );

      return {
        id,
        stage,
        data: response,
      };
    } catch (error) {
      return rejectWithValue({
        id,
        message:
          extractErrorMessage(error) ||
          'Failed to update stage.',
      });
    }
  }
);

export const deleteApplication = createAsyncThunk(
  'applications/deleteApplication',

  async (id, { rejectWithValue }) => {
    try {
      const response =
        await applicationService.delete(id);

      return {
        id,
        data: response,
      };
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error) ||
        'Failed to delete application.'
      );
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
      state.warningMessage = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===============================
      // FETCH APPLICATIONS
      // ===============================

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

          const data =
            action.payload || {};

          state.items =
            data.content ||
            data.items ||
            [];

          state.totalPages =
            data.totalPages || 0;

          state.totalElements =
            data.totalElements || 0;

          state.currentPage =
            data.number ?? 0;

          state.size =
            data.size || state.size;
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

      // ===============================
      // MY APPLICATIONS
      // ===============================

      .addCase(
        fetchMyApplications.fulfilled,
        (state, action) => {
          const data =
            action.payload;

          state.myApplications =
            data?.content ||
            data?.items ||
            data ||
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

      // ===============================
      // T21 CREATE SUCCESS
      // ===============================

      .addCase(
        applyToJob.fulfilled,
        (state, action) => {
          state.error = null;
          state.warningMessage = null;

          const response =
            action.payload || {};

          state.successMessage =
            response.message ||
            response.successMessage ||
            response.data?.message ||
            'Application Submitted Successfully';
        }
      )

      // ===============================
      // T23 CAPACITY WARNING
      // ===============================

      .addCase(
        applyToJob.rejected,
        (state, action) => {
          state.successMessage = null;

          const payload =
            action.payload;

          if (
            payload &&
            typeof payload === 'object' &&
            payload.conflict
          ) {
            state.warningMessage =
              payload.message ||
              'Application capacity exceeded';

            state.error = null;
            return;
          }

          const message =
            typeof payload === 'string'
              ? payload
              : payload?.message || '';

          if (
            /capacity/i.test(message) ||
            /exceed/i.test(message) ||
            /full/i.test(message)
          ) {
            state.warningMessage =
              message ||
              'Application capacity exceeded';

            state.error = null;
            return;
          }

          state.error =
            message ||
            'Failed to submit application.';
        }
      )

      // ===============================
      // UPDATE STAGE
      // ===============================

      .addCase(
        updateStage.fulfilled,
        (state, action) => {
          state.error = null;

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

      // ===============================
      // DELETE
      // ===============================

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