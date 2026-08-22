import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import applicationService
  from "../../services/applicationService";

export const fetchApplications =
  createAsyncThunk(
    "applications/fetchApplications",
    async (
      {
        page = 0,
        size = 5,
        search = ""
      } = {},
      thunkAPI
    ) => {
      try {
        return await applicationService.getAll(
          page,
          size,
          search
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to fetch applications"
        );
      }
    }
  );

export const fetchMyApplications =
  createAsyncThunk(
    "applications/fetchMyApplications",
    async (_, thunkAPI) => {
      try {
        return await applicationService
          .getMyApplications();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to fetch applications"
        );
      }
    }
  );

export const applyJob =
  createAsyncThunk(
    "applications/applyJob",
    async (jobId, thunkAPI) => {
      try {
        return await applicationService.apply(
          jobId
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          {
            message:
              error.response?.data?.message ||
              "Application failed"
          }
        );
      }
    }
  );

export const updateStage =
  createAsyncThunk(
    "applications/updateStage",
    async (
      { id, stage },
      thunkAPI
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
          response
        };
      } catch (error) {
        return thunkAPI.rejectWithValue(
          {
            id,
            message:
              error.response?.data?.message ||
              "Application update failed"
          }
        );
      }
    }
  );

export const deleteApplication =
  createAsyncThunk(
    "applications/deleteApplication",
    async (id, thunkAPI) => {
      try {
        const response =
          await applicationService.delete(id);

        return {
          id,
          response
        };
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Application delete failed"
        );
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
  error: null,
  success: null,
  warning: null
};

const applicationSlice =
  createSlice({
    name: "applications",

    initialState,

    reducers: {
      clearMessages: (state) => {
        state.error = null;
        state.success = null;
        state.warning = null;
      }
    },

    extraReducers: (builder) => {
      builder

        // FETCH ALL
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
              action.payload;

            state.items =
              Array.isArray(data)
                ? data
                : data.content || [];

            state.totalPages =
              data.totalPages || 1;

            state.totalElements =
              data.totalElements ??
              state.items.length;

            state.currentPage =
              data.number || 0;

            state.size =
              data.size || 5;
          }
        )

        .addCase(
          fetchApplications.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload ||
              "Failed to fetch applications";
          }
        )

        // FETCH MY APPLICATIONS
        .addCase(
          fetchMyApplications.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchMyApplications.fulfilled,
          (state, action) => {
            state.loading = false;

            state.items =
              Array.isArray(action.payload)
                ? action.payload
                : action.payload?.content || [];

            state.currentPage = 0;
            state.totalPages = 1;

            state.totalElements =
              state.items.length;
          }
        )

        .addCase(
          fetchMyApplications.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload ||
              "Failed to fetch applications";
          }
        )

        // APPLY
        .addCase(
          applyJob.fulfilled,
          (state, action) => {
            state.success =
              action.payload?.message ||
              "Application submitted successfully.";
          }
        )

        .addCase(
          applyJob.rejected,
          (state, action) => {
            state.warning =
              action.payload?.message ||
              "Application failed";
          }
        )

        // UPDATE STAGE
        .addCase(
          updateStage.fulfilled,
          (state, action) => {
            const item =
              state.items.find(
                application =>
                  application.id ===
                  action.payload.id
              );

            if (item) {
              item.currentStage =
                action.payload.stage;
            }

            state.success =
              action.payload?.response?.message ||
              "Application updated successfully.";
          }
        )

        .addCase(
          updateStage.rejected,
          (state, action) => {
            state.error =
              action.payload?.message ||
              "Application update failed";
          }
        )

        // DELETE
        .addCase(
          deleteApplication.fulfilled,
          (state, action) => {
            state.items =
              state.items.filter(
                application =>
                  application.id !==
                  action.payload.id
              );

            state.totalElements =
              Math.max(
                0,
                state.totalElements - 1
              );

            state.success =
              action.payload?.response?.message ||
              "Application deleted successfully.";
          }
        )

        .addCase(
          deleteApplication.rejected,
          (state, action) => {
            state.error =
              action.payload ||
              "Application delete failed";
          }
        );
    }
  });

export const {
  clearMessages
} = applicationSlice.actions;

export default applicationSlice.reducer;