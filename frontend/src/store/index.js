import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import jobReducer from "./slices/jobSlice";
import applicationReducer from "./slices/applicationSlice";
import interviewReducer from "./slices/interviewSlice";
import candidateReducer from "./slices/candidateSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    interviews: interviewReducer,
    candidate: candidateReducer,
  }
});

export default store;