import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import applicationService from "../../services/applicationService";

const initialState = {
  items: [],
  currentPage: 0,
  totalPages: 1,
  totalElements: 0,
  size: 5,

  loading: false,
  error: null,
  success: null,

  searchQuery: "",
};

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (
    { page = 0, size = 5 } = {},
    { rejectWithValue }
  ) => {
    try {
      return await applicationService.getAll(page, size);
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load applications.",
      });
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMyApplications",
  async (_, { rejectWithValue }) => {
    try {
      if (typeof applicationService.getMyApplications === "function") {
        return await applicationService.getMyApplications();
      }

      return await applicationService.getAll(0, 5);
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load applications.",
      });
    }
  }
);

export const applyToJob = createAsyncThunk(
  "applications/applyToJob",
  async (jobId, { rejectWithValue }) => {
    try {
      return await applicationService.apply(jobId);
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to submit application.",
      });
    }
  }
);

// Alias expected by JobList
export const applyForJob = applyToJob;

export const updateApplicationStage = createAsyncThunk(
  "applications/updateApplicationStage",
  async ({ id, stage }, { rejectWithValue }) => {
    try {
      return await applicationService.updateStage(id, stage);
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update application.",
      });
    }
  }
);

// Alias expected by ApplicationList
export const updateStage = updateApplicationStage;

export const deleteApplication = createAsyncThunk(
  "applications/deleteApplication",
  async (id, { rejectWithValue }) => {
    try {
      return await applicationService.delete(id);
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete application.",
      });
    }
  }
);

export const optimisticStageUpdate = (payload) => ({
  type: "applications/optimisticStageUpdate",
  payload,
});

export const setSearchQuery = (query) => ({
  type: "applications/setSearchQuery",
  payload: query,
});

export const clearMessages = () => ({
  type: "applications/clearMessages",
});

const applicationSlice = createSlice({
  name: "applications",

  initialState,

  reducers: {
    optimisticStageUpdate: (state, action) => {
      const { id, stage } = action.payload || {};

      const item = state.items.find(
        (application) =>
          String(application.id) === String(id) ||
          String(application.applicationId) === String(id)
      );

      if (item) {
        item.currentStage = stage;
        item.stage = stage;
      }
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload || "";
    },

    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH ALL
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload || {};

        if (Array.isArray(data)) {
          state.items = data;
          state.totalPages = 1;
          state.totalElements = data.length;
        } else {
          state.items = data.content || [];
          state.totalPages = data.totalPages ?? 1;
          state.totalElements =
            data.totalElements ?? state.items.length;

          state.currentPage = data.number ?? state.currentPage;
          state.size = data.size ?? state.size;
        }
      })

      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          "Failed to load applications.";
      })

      // FETCH MY APPLICATIONS
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload;

        if (Array.isArray(data)) {
          state.items = data;
          state.totalPages = 1;
          state.totalElements = data.length;
        } else {
          state.items = data?.content || [];
          state.totalPages = data?.totalPages ?? 1;
          state.totalElements =
            data?.totalElements ??
            state.items.length;
        }
      })

      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          "Failed to load applications.";
      })

      // APPLY
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(applyToJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success =
          action.payload?.message ||
          "Application submitted successfully.";
      })

      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message ||
          "Failed to submit application.";
      })

      // UPDATE STAGE
      .addCase(updateApplicationStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateApplicationStage.fulfilled, (state, action) => {
        state.loading = false;

        state.success =
          action.payload?.message ||
          "Application updated successfully.";
      })

      .addCase(updateApplicationStage.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message ||
          "Failed to update application.";
      })

      // DELETE
      .addCase(deleteApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.loading = false;

        const deletedId =
          action.meta?.arg;

        state.items = state.items.filter(
          (item) =>
            String(item.id) !== String(deletedId) &&
            String(item.applicationId) !== String(deletedId)
        );

        state.success =
          action.payload?.message ||
          "Application deleted successfully.";
      })

      .addCase(deleteApplication.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message ||
          "Failed to delete application.";
      });
  },
});

export const {
  clearMessages: clearApplicationMessages,
} = applicationSlice.actions;

export default applicationSlice.reducer;