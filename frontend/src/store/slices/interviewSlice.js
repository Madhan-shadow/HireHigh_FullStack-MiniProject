import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import interviewService from "../../services/interviewService";


export const fetchInterviews =
  createAsyncThunk(
    "interviews/fetch",
    async () => {
      return await interviewService.getAll();
    }
  );


export const createInterview =
  createAsyncThunk(
    "interviews/create",
    async (data) => {
      return await interviewService.create(data);
    }
  );


export const recordFeedback =
  createAsyncThunk(
    "interviews/feedback",
    async ({
      id,
      feedback
    }) => {
      return await interviewService.recordFeedback(
        id,
        feedback
      );
    }
  );


const interviewSlice =
  createSlice({

    name: "interviews",

    initialState: {

      items: [],

      loading: false,

      error: null
    },

    reducers: {},

    extraReducers: builder => {

      builder.addCase(
        fetchInterviews.pending,
        state => {

          state.loading = true;
        }
      );

      builder.addCase(
        fetchInterviews.fulfilled,
        (state, action) => {

          state.loading = false;

          state.items =
            action.payload?.content ||
            action.payload ||
            [];
        }
      );

      builder.addCase(
        fetchInterviews.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.error?.message ||
            "Failed to load interviews";
        }
      );
    }
  });


export default interviewSlice.reducer;