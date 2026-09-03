import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import jobService from "../../services/jobService";


// ================================
// FETCH JOBS
// ================================

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",

  async () => {
    return await jobService.getAll();
  }
);


// ================================
// CREATE JOB
// ================================

export const createJob = createAsyncThunk(
  "jobs/createJob",

  async (jobData) => {
    return await jobService.create(jobData);
  }
);


// ================================
// UPDATE JOB
// ================================

export const updateJob = createAsyncThunk(
  "jobs/updateJob",

  async ({ id, data }) => {
    return await jobService.update(
      id,
      data
    );
  }
);


// ================================
// DELETE JOB
// ================================

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",

  async (id) => {
    return await jobService.delete(id);
  }
);


// ================================
// SLICE
// ================================

const jobSlice = createSlice({
  name: "jobs",

  initialState: {
    items: [],

    loading: false,

    error: null,

    searchQuery: ""
  },

  reducers: {

    setSearchQuery(
      state,
      action
    ) {
      state.searchQuery =
        action.payload;
    }

  },

  extraReducers: (builder) => {

    // FETCH

    builder.addCase(
      fetchJobs.pending,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addCase(
      fetchJobs.fulfilled,
      (state, action) => {

        state.loading = false;

        const response =
          action.payload;

        const jobs =
          response?.content ||
          response ||
          [];

        state.items =
          Array.isArray(jobs)
            ? jobs
            : [];
      }
    );

    builder.addCase(
      fetchJobs.rejected,
      (state, action) => {

        state.loading = false;

        state.error =
          action.error?.message ||
          "Failed to load jobs";
      }
    );


    // CREATE

    builder.addCase(
      createJob.fulfilled,
      (state, action) => {

        if (action.payload) {

          state.items.unshift(
            action.payload
          );

        }
      }
    );


    // UPDATE

    builder.addCase(
      updateJob.fulfilled,
      (state, action) => {

        const updated =
          action.payload;

        if (!updated) {
          return;
        }

        const index =
          state.items.findIndex(
            job =>
              job.id ===
              updated.id
          );

        if (index !== -1) {

          state.items[index] =
            updated;

        }
      }
    );


    // DELETE

    builder.addCase(
      deleteJob.fulfilled,
      (state, action) => {

        const deletedId =
          action.meta.arg;

        state.items =
          state.items.filter(
            job =>
              job.id !==
              deletedId
          );
      }
    );
  }
});


// ================================
// EXPORTS
// ================================

export const {
  setSearchQuery
} = jobSlice.actions;


// ================================
// FILTERED JOB SELECTOR
// ================================

export const selectFilteredJobs =
  (state) => {

    const query =
      (
        state.jobs.searchQuery ||
        ""
      )
        .toLowerCase()
        .trim();

    if (!query) {
      return state.jobs.items;
    }

    return state.jobs.items.filter(
      job => {

        const values = [
          job.title,
          job.department,
          job.description
        ];

        return values
          .filter(Boolean)
          .some(
            value =>
              String(value)
                .toLowerCase()
                .includes(query)
          );
      }
    );
  };


export default jobSlice.reducer;