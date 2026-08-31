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
//   if (typeof err === 'string' && /401|unauthorized/i.test(err)) return true;
//   if (err.message && /401|unauthorized/i.test(err.message)) return true;
//   return false;
// };

// const is409 = (err) => err?.response?.status === 409 || err?.status === 409;

// const extractMessage = (payload, fallback) => {
//   if (!payload) return fallback;
//   if (typeof payload === 'string') return payload;
//   if (payload.response?.data?.message) return payload.response.data.message;
//   if (payload.data?.message) return payload.data.message;
//   if (payload.message) return payload.message;
//   return fallback;
// };

// export const fetchApplications = createAsyncThunk(
//   'applications/fetchApplications',
//   async ({ page = 0, size = 5, stage } = {}, { rejectWithValue }) => {
//     try {
//       return await applicationService.getAll(page, size, stage);
//     } catch (err) {
//       if (is401(err)) clearSession();
//       return rejectWithValue(extractMessage(err, 'Failed to load applications. Please try again.'));
//     }
//   }
// );

// export const applyToJob = createAsyncThunk(
//   'applications/applyToJob',
//   async (jobId, { rejectWithValue }) => {
//     try {
//       const data = await applicationService.apply(jobId);

//       // DIAGNOSTIC — remove after you've captured this once
//       console.log('[DIAG] apply success raw data:', JSON.stringify(data));

//       return data;
//     } catch (err) {
//       if (is401(err)) clearSession();

//       // DIAGNOSTIC — remove after you've captured this once
//       console.log('[DIAG] apply error status:', err?.response?.status);
//       console.log('[DIAG] apply error response.data:', JSON.stringify(err?.response?.data));
//       console.log('[DIAG] apply error.message:', err?.message);

//       const rawMessage = extractMessage(err, '');

//       if (is409(err) || /duplicate|already applied|capacity|exceed|full/i.test(rawMessage)) {
//         return rejectWithValue({ conflict: true, message: rawMessage || 'Application capacity exceeded' });
//       }
//       return rejectWithValue({ conflict: false, message: rawMessage || 'Failed to submit application.' });
//     }
//   }
// );

// export const updateStage = createAsyncThunk(
//   'applications/updateStage',
//   async ({ id, stage }, { rejectWithValue }) => {
//     try {
//       const data = await applicationService.updateStage(id, stage);
//       return { id, stage, data };
//     } catch (err) {
//       if (is401(err)) clearSession();
//       return rejectWithValue({ id, message: extractMessage(err, 'Failed to update stage.') });
//     }
//   }
// );

// export const deleteApplication = createAsyncThunk(
//   'applications/deleteApplication',
//   async (id, { rejectWithValue }) => {
//     try {
//       const data = await applicationService.delete(id);
//       return { id, data };
//     } catch (err) {
//       if (is401(err)) clearSession();
//       return rejectWithValue(extractMessage(err, 'Failed to delete application.'));
//     }
//   }
// );

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
//       .addCase(fetchApplications.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchApplications.fulfilled, (state, action) => {
//         state.loading = false;
//         const { content, totalPages, totalElements, number, size } = action.payload || {};
//         state.items = content || [];
//         state.totalPages = totalPages ?? 0;
//         state.totalElements = totalElements ?? 0;
//         state.currentPage = number ?? 0;
//         state.size = size ?? state.size;
//       })
//       .addCase(fetchApplications.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to load applications. Please try again.';
//       })
//       .addCase(applyToJob.fulfilled, (state, action) => {
//         state.error = null;
//         state.warningMessage = null;
//         state.successMessage = extractMessage(action.payload, 'Application submitted successfully.');

//         // DIAGNOSTIC — remove after you've captured this once
//         console.log('[DIAG] successMessage set to:', state.successMessage);
//       })
//       .addCase(applyToJob.rejected, (state, action) => {
//         state.successMessage = null;
//         const payload = action.payload;

//         // DIAGNOSTIC — remove after you've captured this once
//         console.log('[DIAG] applyToJob.rejected payload:', JSON.stringify(payload));

//         if (payload && typeof payload === 'object' && payload.conflict) {
//           state.warningMessage = payload.message || 'Application capacity exceeded';
//           state.error = null;
//         } else {
//           state.error = extractMessage(payload, 'Failed to submit application.');
//           state.warningMessage = null;
//         }

//         // DIAGNOSTIC — remove after you've captured this once
//         console.log('[DIAG] warningMessage set to:', state.warningMessage, '| error set to:', state.error);
//       })
//       .addCase(updateStage.pending, (state, action) => {
//         const { id, stage } = action.meta.arg;
//         const item = state.items.find((a) => a.id === id);
//         if (item) item.currentStage = stage;
//       })
//       .addCase(updateStage.fulfilled, (state, action) => {
//         state.successMessage = extractMessage(action.payload?.data, 'Application updated successfully.');
//       })
//       .addCase(updateStage.rejected, (state, action) => {
//         state.error = extractMessage(action.payload, 'Failed to update stage.');
//       })
//       .addCase(deleteApplication.fulfilled, (state, action) => {
//         state.items = state.items.filter((a) => a.id !== action.payload.id);
//         state.successMessage = extractMessage(action.payload.data, 'Application deleted successfully.');
//       })
//       .addCase(deleteApplication.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearMessages } = applicationSlice.actions;
// export default applicationSlice.reducer;import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';

const CAPACITY_WARNING_MSG = 'Application capacity exceeded';

export const fetchApplications = createAsyncThunk(
  'applications/fetchAll',
  async ({ page = 0, size = 5, stage } = {}, { rejectWithValue }) => {
    try {
      const response = await applicationService.getAll(page, size, stage);
      // expected shape: { content: [], totalPages, totalElements, number, size }
      return response;
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err?.message || 'Failed to load applications';
      return rejectWithValue({ status, message });
    }
  }
);

export const applyToJob = createAsyncThunk(
  'applications/apply',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await applicationService.apply(jobId);
      // expected shape: { message: "Application submitted successfully." }
      return response;
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err?.message || 'Failed to apply';
      return rejectWithValue({ status, message });
    }
  }
);

export const updateApplicationStage = createAsyncThunk(
  'applications/updateStage',
  async ({ id, stage }, { rejectWithValue }) => {
    try {
      const response = await applicationService.updateStage(id, stage);
      return { id, stage, response };
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err?.message || 'Failed to update application';
      return rejectWithValue({ status, message });
    }
  }
);

export const deleteApplication = createAsyncThunk(
  'applications/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await applicationService.delete(id);
      // expected shape: { message: "Application deleted successfully." }
      return { id, response };
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err?.message || 'Failed to delete application';
      return rejectWithValue({ status, message });
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
  successMessage: null,
  warningMessage: null,
  error: null,
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.warningMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.content || [];
        state.totalPages = action.payload?.totalPages ?? 0;
        state.totalElements = action.payload?.totalElements ?? 0;
        state.currentPage = action.payload?.number ?? 0;
        state.size = action.payload?.size ?? state.size;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load applications';
      })

      // APPLY (CREATE)
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.successMessage = action.payload?.message || 'Application submitted successfully.';
      })
      .addCase(applyToJob.rejected, (state, action) => {
        const status = action.payload?.status;
        if (status === 409 || status === 403) {
          // Duplicate application or capacity exceeded both surface as the fixed warning text
          state.warningMessage = CAPACITY_WARNING_MSG;
        } else {
          state.error = action.payload?.message || 'Failed to apply';
        }
      })

      // UPDATE STAGE
      .addCase(updateApplicationStage.pending, (state, action) => {
        // optimistic update
        const { id, stage } = action.meta.arg;
        const item = state.items.find((a) => a.id === id);
        if (item) item.currentStage = stage;
      })
      .addCase(updateApplicationStage.fulfilled, (state, action) => {
        state.successMessage = action.payload?.response?.message || 'Application updated successfully.';
      })
      .addCase(updateApplicationStage.rejected, (state, action) => {
        const status = action.payload?.status;
        if (status === 409 || status === 403) {
          state.warningMessage = CAPACITY_WARNING_MSG;
        } else {
          state.error = action.payload?.message || 'Failed to update application';
        }
      })

      // DELETE
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload.id);
        state.successMessage = action.payload?.response?.message || 'Application deleted successfully.';
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to delete application';
      });
  },
});

export const { clearMessages } = applicationSlice.actions;
export default applicationSlice.reducer;