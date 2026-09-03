import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import applicationService from "../../services/applicationService";


// ======================================
// GET APPLICATIONS
// ======================================

export const fetchApplications =
  createAsyncThunk(

    "applications/fetchApplications",

    async ({
      page = 0,
      size = 5
    } = {}) => {

      return await applicationService.getAll(
        page,
        size
      );
    }
  );


// ======================================
// APPLY TO JOB
// ======================================

export const applyToJob =
  createAsyncThunk(

    "applications/applyToJob",

    async (jobId) => {

      return await applicationService.apply(
        jobId
      );
    }
  );


// ======================================
// UPDATE STAGE
// ======================================

export const updateApplicationStage =
  createAsyncThunk(

    "applications/updateApplicationStage",

    async ({
      id,
      stage
    }) => {

      return await applicationService.updateStage(
        id,
        stage
      );
    }
  );


// ======================================
// DELETE APPLICATION
// ======================================

export const deleteApplication =
  createAsyncThunk(

    "applications/deleteApplication",

    async (id) => {

      return await applicationService.delete(
        id
      );
    }
  );


// ======================================
// SLICE
// ======================================

const applicationSlice =
  createSlice({

    name: "applications",

    initialState: {

      items: [],

      currentPage: 0,

      totalPages: 1,

      totalElements: 0,

      loading: false,

      error: null,

      message: null
    },

    reducers: {

      clearMessages(state) {

        state.message = null;

        state.error = null;
      }
    },

    extraReducers: builder => {

      // =============================
      // GET ALL
      // =============================

      builder.addCase(
        fetchApplications.pending,
        state => {

          state.loading = true;

          state.error = null;
        }
      );

      builder.addCase(
        fetchApplications.fulfilled,
        (state, action) => {

          state.loading = false;

          const response =
            action.payload || {};

          state.items =
            response.content || [];

          state.currentPage =
            response.number ?? 0;

          state.totalPages =
            response.totalPages ?? 1;

          state.totalElements =
            response.totalElements ??
            state.items.length;
        }
      );

      builder.addCase(
        fetchApplications.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.error?.message ||
            "Failed to load applications";
        }
      );


      // =============================
      // APPLY
      // =============================

      builder.addCase(
        applyToJob.fulfilled,
        (state, action) => {

          state.message =
            action.payload?.message ||
            "Application submitted successfully.";
        }
      );


      // =============================
      // UPDATE
      // =============================

      builder.addCase(
        updateApplicationStage.pending,
        (state, action) => {

          const {
            id,
            stage
          } = action.meta.arg;

          const application =
            state.items.find(
              item =>
                item.id === id
            );

          if (application) {

            application.currentStage =
              stage;
          }
        }
      );

      builder.addCase(
        updateApplicationStage.fulfilled,
        (state, action) => {

          state.message =
            action.payload?.message ||
            "Application updated successfully.";
        }
      );

      builder.addCase(
        updateApplicationStage.rejected,
        (state, action) => {

          state.error =
            action.error?.message ||
            "Failed to update application";
        }
      );


      // =============================
      // DELETE
      // =============================

      builder.addCase(
        deleteApplication.fulfilled,
        (state, action) => {

          const id =
            action.meta.arg;

          state.items =
            state.items.filter(
              item =>
                item.id !== id
            );

          state.message =
            action.payload?.message ||
            "Application deleted successfully.";
        }
      );

      builder.addCase(
        deleteApplication.rejected,
        (state, action) => {

          state.error =
            action.error?.message ||
            "Failed to delete application";
        }
      );
    }
  });


export const {
  clearMessages
} = applicationSlice.actions;


export default applicationSlice.reducer;