import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import applicationService from "../../services/applicationService";

export const CRUD_CREATE_MSG =
  "Application submitted successfully.";

export const CRUD_UPDATE_MSG =
  "Application updated successfully.";

export const CRUD_DELETE_MSG =
  "Application deleted successfully.";

export const CAPACITY_WARNING_MSG =
  "Application capacity exceeded";

const initialState = {

  items: [],

  currentPage: 0,

  totalPages: 0,

  totalElements: 0,

  number: 0,

  size: 5,

  loading: false,

  error: null,

  successMessage: null,

  warningMessage: null,

  searchQuery: ""
};

/* =========================
   FETCH ALL APPLICATIONS
========================= */

export const fetchApplications =
  createAsyncThunk(

    "applications/fetchApplications",

    async (
      {
        page = 0,
        size = 5
      } = {},
      thunkAPI
    ) => {

      try {

        return await applicationService.getAll(
          page,
          size
        );

      } catch (error) {

        return thunkAPI.rejectWithValue(
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load applications"
        );
      }
    }
  );

/* =========================
   FETCH MY APPLICATIONS
========================= */

export const fetchMyApplications =
  createAsyncThunk(

    "applications/fetchMyApplications",

    async (
      {
        page = 0,
        size = 5,
        username
      } = {},
      thunkAPI
    ) => {

      try {

        return await applicationService.getAll(
          page,
          size,
          username
        );

      } catch (error) {

        return thunkAPI.rejectWithValue(
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load applications"
        );
      }
    }
  );

/* =========================
   APPLY TO JOB
========================= */

export const applyToJob =
  createAsyncThunk(

    "applications/applyToJob",

    async (
      {
        jobId,
        username
      },
      thunkAPI
    ) => {

      try {

        return await applicationService.apply(
          jobId,
          username
        );

      } catch (error) {

        return thunkAPI.rejectWithValue(
          error?.response?.data?.message ||
          error?.message ||
          "Unable to submit application"
        );
      }
    }
  );

/*
 * Alias used by JobList.
 */
export const applyForJob = applyToJob;

/* =========================
   UPDATE STAGE
========================= */

export const updateApplicationStage =
  createAsyncThunk(

    "applications/updateApplicationStage",

    async (
      {
        id,
        stage
      },
      thunkAPI
    ) => {

      try {

        return await applicationService.updateStage(
          id,
          stage
        );

      } catch (error) {

        return thunkAPI.rejectWithValue(
          error?.response?.data?.message ||
          error?.message ||
          "Unable to update application"
        );
      }
    }
  );

/*
 * Alias used by older ApplicationList.
 */
export const updateStage =
  updateApplicationStage;

/* =========================
   DELETE
========================= */

export const deleteApplication =
  createAsyncThunk(

    "applications/deleteApplication",

    async (
      id,
      thunkAPI
    ) => {

      try {

        await applicationService.delete(id);

        return id;

      } catch (error) {

        return thunkAPI.rejectWithValue(
          error?.response?.data?.message ||
          error?.message ||
          "Unable to delete application"
        );
      }
    }
  );

/* =========================
   SLICE
========================= */

const applicationSlice =
  createSlice({

    name: "applications",

    initialState,

    reducers: {

      clearMessages(state) {

        state.error = null;

        state.successMessage = null;

        state.warningMessage = null;
      },

      setBanner(
        state,
        action
      ) {

        state.successMessage =
          action.payload;
      },

      setSearchQuery(
        state,
        action
      ) {

        state.searchQuery =
          action.payload;
      },

      optimisticStageUpdate(
        state,
        action
      ) {

        const {
          id,
          stage
        } = action.payload;

        const application =
          state.items.find(
            (item) =>
              item.id === id
          );

        if (application) {

          application.currentStage =
            stage;
        }
      }
    },

    extraReducers: (builder) => {

      builder

        /* FETCH */

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
              data.content || [];

            state.totalPages =
              data.totalPages ?? 0;

            state.totalElements =
              data.totalElements ?? 0;

            state.currentPage =
              data.number ?? 0;

            state.number =
              data.number ?? 0;

            state.size =
              data.size ?? 5;
          }
        )

        .addCase(
          fetchApplications.rejected,
          (state, action) => {

            state.loading = false;

            state.error =
              action.payload ||
              "Unable to load applications";
          }
        )

        /* MY APPLICATIONS */

        .addCase(
          fetchMyApplications.fulfilled,
          (state, action) => {

            const data =
              action.payload || {};

            state.items =
              data.content || [];

            state.totalPages =
              data.totalPages ?? 0;

            state.totalElements =
              data.totalElements ?? 0;

            state.currentPage =
              data.number ?? 0;

            state.number =
              data.number ?? 0;

            state.size =
              data.size ?? 5;

            state.loading = false;
          }
        )

        /* APPLY */

        .addCase(
          applyToJob.fulfilled,
          (state, action) => {

            state.successMessage =
              action.payload?.message ||
              CRUD_CREATE_MSG;

            state.warningMessage =
              null;
          }
        )

        .addCase(
          applyToJob.rejected,
          (state, action) => {

            const message =
              action.payload ||
              "Unable to submit application";

            state.error = message;

            if (
              String(message)
                .toLowerCase()
                .includes("capacity")
            ) {

              state.warningMessage =
                CAPACITY_WARNING_MSG;
            }
          }
        )

        /* UPDATE */

        .addCase(
          updateApplicationStage.fulfilled,
          (state, action) => {

            const data =
              action.payload || {};

            state.successMessage =
              data.message ||
              CRUD_UPDATE_MSG;

            if (data.id) {

              const item =
                state.items.find(
                  (application) =>
                    application.id ===
                    data.id
                );

              if (item) {

                Object.assign(
                  item,
                  data
                );
              }
            }
          }
        )

        .addCase(
          updateApplicationStage.rejected,
          (state, action) => {

            state.error =
              action.payload ||
              "Unable to update application";
          }
        )

        /* DELETE */

        .addCase(
          deleteApplication.fulfilled,
          (state, action) => {

            state.items =
              state.items.filter(
                (item) =>
                  item.id !==
                  action.payload
              );

            state.successMessage =
              CRUD_DELETE_MSG;
          }
        )

        .addCase(
          deleteApplication.rejected,
          (state, action) => {

            state.error =
              action.payload ||
              "Unable to delete application";
          }
        );
    }
  });

export const {
  clearMessages,
  setBanner,
  setSearchQuery,
  optimisticStageUpdate
} = applicationSlice.actions;

export default applicationSlice.reducer;