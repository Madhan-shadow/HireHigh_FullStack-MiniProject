// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import applicationService from '../../services/applicationService';

// const initialState = {
//   items: [],
//   currentPage: 0,
//   totalPages: 0,
//   totalElements: 0,
//   size: 5,
//   loading: false,
//   error: null,
//   successMessage: null,
//   warningMessage: null,
// };

// const clearSession = () => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('role');
//   localStorage.removeItem('user');
// };

// const is401 = (err) => {
//   if (!err) return false;

//   if (err.response?.status === 401) return true;
//   if (err.status === 401) return true;

//   if (typeof err === 'string' && /401|unauthorized/i.test(err)) {
//     return true;
//   }

//   if (err.message && /401|unauthorized/i.test(err.message)) {
//     return true;
//   }

//   return false;
// };

// const is409 = (err) =>
//   err?.response?.status === 409 || err?.status === 409;

// /**
//  * IMPORTANT: for an Axios error object, `err.message` is ALWAYS a generic
//  * string like "Request failed with status code 500" — it is NOT the
//  * backend's message. We must check the nested response body first,
//  * otherwise the real backend message (e.g. "Internal server error",
//  * "Candidate already applied for this position") never surfaces.
//  */
// const extractMessage = (payload, fallback) => {
//   if (!payload) return fallback;

//   if (typeof payload === 'string') {
//     return payload;
//   }

//   if (payload.response?.data?.message) {
//     return payload.response.data.message;
//   }

//   if (payload.data?.message) {
//     return payload.data.message;
//   }

//   if (payload.message) {
//     return payload.message;
//   }

//   return fallback;
// };

// /* =========================
//    FETCH ALL APPLICATIONS
//    ========================= */

// export const fetchApplications = createAsyncThunk(
//   'applications/fetchApplications',
//   async (
//     { page = 0, size = 5, stage } = {},
//     { rejectWithValue }
//   ) => {
//     try {
//       return await applicationService.getAll(page, size, stage);
//     } catch (err) {
//       if (is401(err)) {
//         clearSession();
//       }

//       return rejectWithValue(
//         extractMessage(
//           err,
//           'Failed to load applications. Please try again.'
//         )
//       );
//     }
//   }
// );

// /* =========================
//    FETCH MY APPLICATIONS
//    ========================= */

// export const fetchMyApplications = createAsyncThunk(
//   'applications/fetchMyApplications',
//   async (_, { rejectWithValue }) => {
//     try {
//       return await applicationService.getMyApplications();
//     } catch (err) {
//       if (is401(err)) {
//         clearSession();
//       }

//       return rejectWithValue(
//         extractMessage(
//           err,
//           'Failed to load your applications. Please try again.'
//         )
//       );
//     }
//   }
// );

// /* =========================
//    APPLY TO JOB
//    ========================= */

// // export const applyToJob = createAsyncThunk(
// //   'applications/applyToJob',
// //   async (jobId, { rejectWithValue }) => {
// //     try {
// //       const data = await applicationService.apply(jobId);
// //       return data;
// //     } catch (err) {
// //       if (is401(err)) {
// //         clearSession();
// //       }

// //       const rawMessage = extractMessage(err, '');

// //       if (
// //         is409(err) ||
// //         /duplicate|already applied|capacity/i.test(rawMessage)
// //       ) {
// //         return rejectWithValue({
// //           conflict: true,
// //           message: 'Application capacity exceeded',
// //         });
// //       }

// //       return rejectWithValue({
// //         conflict: false,
// //         message: rawMessage || 'Failed to submit application.',
// //       });
// //     }
// //   }
// // );
// export const applyToJob = createAsyncThunk(
//   'applications/applyToJob',
//   async (jobId, { rejectWithValue }) => {
//     try {
//       const data = await applicationService.apply(jobId);
//       console.log('DEBUG applyToJob resolved with:', JSON.stringify(data));
//       return data;
//     } catch (err) {
//       console.log('DEBUG applyToJob threw:', err?.message, JSON.stringify(err?.response?.data));
//       // ...keep the rest of your existing catch logic exactly as-is below
// /* =========================
//    UPDATE APPLICATION STAGE
//    ========================= */

// export const updateStage = createAsyncThunk(
//   'applications/updateStage',
//   async ({ id, stage }, { rejectWithValue }) => {
//     try {
//       const data = await applicationService.updateStage(id, stage);
//       return { id, stage, data };
//     } catch (err) {
//       if (is401(err)) {
//         clearSession();
//       }

//       return rejectWithValue({
//         id,
//         message: extractMessage(err, 'Failed to update stage.'),
//       });
//     }
//   }
// );

// /* =========================
//    DELETE APPLICATION
//    ========================= */

// export const deleteApplication = createAsyncThunk(
//   'applications/deleteApplication',
//   async (id, { rejectWithValue }) => {
//     try {
//       const data = await applicationService.delete(id);
//       return { id, data };
//     } catch (err) {
//       if (is401(err)) {
//         clearSession();
//       }

//       return rejectWithValue(
//         extractMessage(err, 'Failed to delete application.')
//       );
//     }
//   }
// );

// /* =========================
//    SLICE
//    ========================= */

// const applicationSlice = createSlice({
//   name: 'applications',
//   initialState,
//   reducers: {
//     clearMessages: (state) => {
//       state.successMessage = null;
//       state.error = null;
//       state.warningMessage = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       /* FETCH ALL APPLICATIONS */
//       .addCase(fetchApplications.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchApplications.fulfilled, (state, action) => {
//         state.loading = false;

//         const { content, totalPages, totalElements, number, size } =
//           action.payload || {};

//         state.items = content || [];
//         state.totalPages = totalPages ?? 0;
//         state.totalElements = totalElements ?? 0;
//         state.currentPage = number ?? 0;
//         state.size = size ?? state.size;
//       })
//       .addCase(fetchApplications.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.payload || 'Failed to load applications. Please try again.';
//       })

//       /* FETCH MY APPLICATIONS */
//       .addCase(fetchMyApplications.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMyApplications.fulfilled, (state, action) => {
//         state.loading = false;

//         if (Array.isArray(action.payload)) {
//           state.items = action.payload;
//           state.currentPage = 0;
//           state.totalPages = 1;
//           state.totalElements = action.payload.length;
//         } else {
//           const { content, totalPages, totalElements, number, size } =
//             action.payload || {};

//           state.items = content || [];
//           state.totalPages = totalPages ?? 1;
//           state.totalElements = totalElements ?? state.items.length;
//           state.currentPage = number ?? 0;
//           state.size = size ?? state.size;
//         }
//       })
//       .addCase(fetchMyApplications.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.payload ||
//           'Failed to load your applications. Please try again.';
//       })

//       /* APPLY TO JOB */
//       .addCase(applyToJob.fulfilled, (state, action) => {
//         state.successMessage = extractMessage(
//           action.payload,
//           'Application submitted successfully.'
//         );
//         state.warningMessage = null;
//         state.error = null;
//       })
//       .addCase(applyToJob.rejected, (state, action) => {
//         const payload = action.payload;

//         if (payload && typeof payload === 'object' && payload.conflict) {
//           state.warningMessage =
//             payload.message || 'Application capacity exceeded';
//           state.error = null;
//         } else {
//           state.error = extractMessage(
//             payload,
//             'Failed to submit application.'
//           );
//           state.warningMessage = null;
//         }
//       })

//       /* UPDATE STAGE */
//       .addCase(updateStage.pending, (state, action) => {
//         const { id, stage } = action.meta.arg;
//         const item = state.items.find((a) => a.id === id);

//         if (item) {
//           item.currentStage = stage;
//         }
//       })
//       .addCase(updateStage.fulfilled, (state, action) => {
//         state.successMessage = extractMessage(
//           action.payload?.data,
//           'Application updated successfully.'
//         );
//       })
//       .addCase(updateStage.rejected, (state, action) => {
//         state.error = extractMessage(
//           action.payload,
//           'Failed to update stage.'
//         );
//       })

//       /* DELETE APPLICATION */
//       .addCase(deleteApplication.fulfilled, (state, action) => {
//         state.items = state.items.filter((a) => a.id !== action.payload.id);
//         state.successMessage = extractMessage(
//           action.payload.data,
//           'Application deleted successfully.'
//         );
//       })
//       .addCase(deleteApplication.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearMessages } = applicationSlice.actions;
// export default applicationSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';

const initialState = {
  items: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 5,
  loading: false,
  error: null,
  successMessage: null,
  warningMessage: null,
};

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};

const is401 = (err) => {
  if (!err) return false;

  if (err.response?.status === 401) return true;
  if (err.status === 401) return true;

  if (typeof err === 'string' && /401|unauthorized/i.test(err)) {
    return true;
  }

  if (err.message && /401|unauthorized/i.test(err.message)) {
    return true;
  }

  return false;
};

const is409 = (err) =>
  err?.response?.status === 409 || err?.status === 409;

/**
 * IMPORTANT: for an Axios error object, `err.message` is ALWAYS a generic
 * string like "Request failed with status code 500" — it is NOT the
 * backend's message. We must check the nested response body first,
 * otherwise the real backend message (e.g. "Internal server error",
 * "Candidate already applied for this position") never surfaces.
 */
const extractMessage = (payload, fallback) => {
  if (!payload) return fallback;

  if (typeof payload === 'string') {
    return payload;
  }

  if (payload.response?.data?.message) {
    return payload.response.data.message;
  }

  if (payload.data?.message) {
    return payload.data.message;
  }

  if (payload.message) {
    return payload.message;
  }

  return fallback;
};

/* =========================
   FETCH ALL APPLICATIONS
   ========================= */

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (
    { page = 0, size = 5, stage } = {},
    { rejectWithValue }
  ) => {
    try {
      return await applicationService.getAll(page, size, stage);
    } catch (err) {
      if (is401(err)) {
        clearSession();
      }

      return rejectWithValue(
        extractMessage(
          err,
          'Failed to load applications. Please try again.'
        )
      );
    }
  }
);

/* =========================
   FETCH MY APPLICATIONS
   ========================= */

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      return await applicationService.getMyApplications();
    } catch (err) {
      if (is401(err)) {
        clearSession();
      }

      return rejectWithValue(
        extractMessage(
          err,
          'Failed to load your applications. Please try again.'
        )
      );
    }
  }
);

/* =========================
   APPLY TO JOB
   ========================= */

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await applicationService.apply(jobId);
      return data;
    } catch (err) {
      if (is401(err)) {
        clearSession();
      }

      const rawMessage = extractMessage(err, '');

      if (
        is409(err) ||
        /duplicate|already applied|capacity/i.test(rawMessage)
      ) {
        return rejectWithValue({
          conflict: true,
          message: 'Application capacity exceeded',
        });
      }

      return rejectWithValue({
        conflict: false,
        message: rawMessage || 'Failed to submit application.',
      });
    }
  }
);

/* =========================
   UPDATE APPLICATION STAGE
   ========================= */

export const updateStage = createAsyncThunk(
  'applications/updateStage',
  async ({ id, stage }, { rejectWithValue }) => {
    try {
      const data = await applicationService.updateStage(id, stage);
      return { id, stage, data };
    } catch (err) {
      if (is401(err)) {
        clearSession();
      }

      return rejectWithValue({
        id,
        message: extractMessage(err, 'Failed to update stage.'),
      });
    }
  }
);

/* =========================
   DELETE APPLICATION
   ========================= */

export const deleteApplication = createAsyncThunk(
  'applications/deleteApplication',
  async (id, { rejectWithValue }) => {
    try {
      const data = await applicationService.delete(id);
      return { id, data };
    } catch (err) {
      if (is401(err)) {
        clearSession();
      }

      return rejectWithValue(
        extractMessage(err, 'Failed to delete application.')
      );
    }
  }
);

/* =========================
   SLICE
   ========================= */

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
      state.warningMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH ALL APPLICATIONS */
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;

        const { content, totalPages, totalElements, number, size } =
          action.payload || {};

        state.items = content || [];
        state.totalPages = totalPages ?? 0;
        state.totalElements = totalElements ?? 0;
        state.currentPage = number ?? 0;
        state.size = size ?? state.size;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || 'Failed to load applications. Please try again.';
      })

      /* FETCH MY APPLICATIONS */
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;

        if (Array.isArray(action.payload)) {
          state.items = action.payload;
          state.currentPage = 0;
          state.totalPages = 1;
          state.totalElements = action.payload.length;
        } else {
          const { content, totalPages, totalElements, number, size } =
            action.payload || {};

          state.items = content || [];
          state.totalPages = totalPages ?? 1;
          state.totalElements = totalElements ?? state.items.length;
          state.currentPage = number ?? 0;
          state.size = size ?? state.size;
        }
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          'Failed to load your applications. Please try again.';
      })

      /* APPLY TO JOB */
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.successMessage = extractMessage(
          action.payload,
          'Application submitted successfully.'
        );
        state.warningMessage = null;
        state.error = null;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        const payload = action.payload;

        if (payload && typeof payload === 'object' && payload.conflict) {
          state.warningMessage =
            payload.message || 'Application capacity exceeded';
          state.error = null;
        } else {
          state.error = extractMessage(
            payload,
            'Failed to submit application.'
          );
          state.warningMessage = null;
        }
      })

      /* UPDATE STAGE */
      .addCase(updateStage.pending, (state, action) => {
        const { id, stage } = action.meta.arg;
        const item = state.items.find((a) => a.id === id);

        if (item) {
          item.currentStage = stage;
        }
      })
      .addCase(updateStage.fulfilled, (state, action) => {
        state.successMessage = extractMessage(
          action.payload?.data,
          'Application updated successfully.'
        );
      })
      .addCase(updateStage.rejected, (state, action) => {
        state.error = extractMessage(
          action.payload,
          'Failed to update stage.'
        );
      })

      /* DELETE APPLICATION */
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload.id);
        state.successMessage = extractMessage(
          action.payload.data,
          'Application deleted successfully.'
        );
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = applicationSlice.actions;
export default applicationSlice.reducer;