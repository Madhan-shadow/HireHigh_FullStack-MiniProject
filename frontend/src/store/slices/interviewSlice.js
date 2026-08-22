import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import interviewService
  from "../../services/interviewService";

export const fetchInterviews =
  createAsyncThunk(
    "interviews/fetchInterviews",
    async (_, thunkAPI) => {
      try {
        return await interviewService.getAll();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to fetch interviews"
        );
      }
    }
  );

export const createInterview =
  createAsyncThunk(
    "interviews/createInterview",
    async (data, thunkAPI) => {
      try {
        return await interviewService.create(
          data
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to create interview"
        );
      }
    }
  );

export const updateInterview =
  createAsyncThunk(
    "interviews/updateInterview",
    async (
      { id, data },
      thunkAPI
    ) => {
      try {
        return await interviewService.update(
          id,
          data
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to update interview"
        );
      }
    }
  );

export const deleteInterview =
  createAsyncThunk(
    "interviews/deleteInterview",
    async (id, thunkAPI) => {
      try {
        await interviewService.delete(id);
        return id;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to delete interview"
        );
      }
    }
  );

export const recordFeedback =
  createAsyncThunk(
    "interviews/recordFeedback",
    async (
      { id, data },
      thunkAPI
    ) => {
      try {
        return await interviewService.feedback(
          id,
          data
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to record feedback"
        );
      }
    }
  );

const initialState = {
  items: [],
  loading: false,
  error: null
};

const interviewSlice =
  createSlice({

    name: "interviews",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

      builder

        .addCase(
          fetchInterviews.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          fetchInterviews.fulfilled,
          (state, action) => {
            state.loading = false;
            state.items =
              action.payload || [];
          }
        )

        .addCase(
          fetchInterviews.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        )

        .addCase(
          createInterview.fulfilled,
          (state, action) => {
            state.items.push(
              action.payload
            );
          }
        )

        .addCase(
          updateInterview.fulfilled,
          (state, action) => {

            const index =
              state.items.findIndex(
                (item) =>
                  item.id ===
                  action.payload.id
              );

            if (index !== -1) {
              state.items[index] =
                action.payload;
            }
          }
        )

        .addCase(
          deleteInterview.fulfilled,
          (state, action) => {

            state.items =
              state.items.filter(
                (item) =>
                  item.id !==
                  action.payload
              );
          }
        );
    }
  });

export default interviewSlice.reducer;