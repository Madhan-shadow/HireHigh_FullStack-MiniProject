import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import jobService
  from "../../services/jobService";

export const fetchJobs =
  createAsyncThunk(
    "jobs/fetchJobs",
    async (_, thunkAPI) => {
      try {
        return await jobService.getAll();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to fetch jobs"
        );
      }
    }
  );

export const createJob =
  createAsyncThunk(
    "jobs/createJob",
    async (jobData, thunkAPI) => {
      try {
        return await jobService.create(
          jobData
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to create job"
        );
      }
    }
  );

export const updateJob =
  createAsyncThunk(
    "jobs/updateJob",
    async (
      { id, jobData },
      thunkAPI
    ) => {
      try {
        return await jobService.update(
          id,
          jobData
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to update job"
        );
      }
    }
  );

export const deleteJob =
  createAsyncThunk(
    "jobs/deleteJob",
    async (id, thunkAPI) => {
      try {
        const result =
          await jobService.delete(id);

        return {
          id,
          ...(
            typeof result === "object"
              ? result
              : {}
          )
        };
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to delete job"
        );
      }
    }
  );

const initialState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: ""
};

const jobSlice = createSlice({

  name: "jobs",

  initialState,

  reducers: {

    setSearchQuery: (
      state,
      action
    ) => {
      state.searchQuery =
        action.payload;
    }

  },

  extraReducers: (builder) => {

    builder

      .addCase(
        fetchJobs.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchJobs.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items =
            action.payload;
        }
      )

      .addCase(
        fetchJobs.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      )

      .addCase(
        createJob.fulfilled,
        (state, action) => {
          state.items.push(
            action.payload
          );
        }
      )

      .addCase(
        createJob.rejected,
        (state, action) => {
          state.error =
            action.payload;
        }
      )

      .addCase(
        updateJob.fulfilled,
        (state, action) => {

          const index =
            state.items.findIndex(
              (job) =>
                job.id ===
                action.payload.id
            );

          if (index !== -1) {
            state.items[index] =
              action.payload;
          }
        }
      )

      .addCase(
        updateJob.rejected,
        (state, action) => {
          state.error =
            action.payload;
        }
      )

      .addCase(
        deleteJob.fulfilled,
        (state, action) => {

          state.items =
            state.items.filter(
              (job) =>
                job.id !==
                action.payload.id
            );
        }
      )

      .addCase(
        deleteJob.rejected,
        (state, action) => {
          state.error =
            action.payload;
        }
      );
  }

});

export const {
  setSearchQuery
} = jobSlice.actions;

export default jobSlice.reducer;