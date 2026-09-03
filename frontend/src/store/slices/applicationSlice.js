import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';

// Exported so tests (and any other module) reference the exact same
// strings the reducer sets — avoids drift and avoids `undefined` imports
// silently breaking `toBeInTheDocument()` assertions.
export const CRUD_CREATE_MSG = 'Application submitted successfully.';
export const CRUD_UPDATE_MSG = 'Application updated successfully.';
export const CRUD_DELETE_MSG = 'Application deleted successfully.';
export const CAPACITY_WARNING_MSG = 'Application capacity exceeded';

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
  if (typeof err === 'string' && /401|unauthorized/i.test(err)) return true;
  if (err.message && /401|unauthorized/i.test(err.message)) return true;
  return false;
};

const is409 = (err) => err?.response?.status === 409 || err?.status === 409;

const extractMessage = (payload, fallback) => {
  if (!payload) return fallback;
  if (typeof payload === 'string') return payload;
  if (payload.response?.data?.message) return payload.response.data.message;
  if (payload.data?.message) return payload.data.message;
  if (payload.message) return payload.message;
  return fallback;
};

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async ({ page = 0, size = 5, stage } = {}, { rejectWithValue }) => {
    try {
      return await applicationService.getAll(page, size, stage);
    } catch (err) {
      if (is401(err)) clearSession();
      return rejectWithValue(extractMessage(err, 'Failed to load applications. Please try again.'));
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      return await applicationService.getMyApplications();
    } catch (err) {
      if (is401(err)) clearSession();
      return rejectWithValue(extractMessage(err, 'Failed to load your applications. Please try again.'));
    }
  }
);

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await applicationService.apply(jobId);
      // eslint-disable-next-line no-console
      console.log('DEBUG applyToJob RESOLVED, jobId:', jobId, 'data:', JSON.stringify(data));
      return data;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(
        'DEBUG applyToJob THREW, jobId:', jobId,
        'err.message:', err?.message,
        'status:', err?.response?.status,
        'responseData:', JSON.stringify(err?.response?.data)
      );

      if (is401(err)) clearSession();
      const rawMessage = extractMessage(err, '');

      if (is409(err) || /duplicate|already applied|capacity/i.test(rawMessage)) {
        return rejectWithValue({ conflict: true, message: CAPACITY_WARNING_MSG });
      }

      return rejectWithValue({ conflict: false, message: rawMessage || 'Failed to submit application.' });
    }
  }
);

export const updateStage = createAsyncThunk(
  'applications/updateStage',
  async ({ id, stage }, { rejectWithValue }) => {
    try {
      const data = await applicationService.updateStage(id, stage);
      return { id, stage, data };
    } catch (err) {
      if (is401(err)) clearSession();
      return rejectWithValue({ id, message: extractMessage(err, 'Failed to update stage.') });
    }
  }
);

export const deleteApplication = createAsyncThunk(
  'applications/deleteApplication',
  async (id, { rejectWithValue }) => {
    try {
      const data = await applicationService.delete(id);
      return { id, data };
    } catch (err) {
      if (is401(err)) clearSession();
      return rejectWithValue(extractMessage(err, 'Failed to delete application.'));
    }
  }
);

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
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        const { content, totalPages, totalElements, number, size } = action.payload || {};
        state.items = content || [];
        state.totalPages = totalPages ?? 0;
        state.totalElements = totalElements ?? 0;
        state.currentPage = number ?? 0;
        state.size = size ?? state.size;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load applications. Please try again.';
      })
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
          const { content, totalPages, totalElements, number, size } = action.payload || {};
          state.items = content || [];
          state.totalPages = totalPages ?? 1;
          state.totalElements = totalElements ?? state.items.length;
          state.currentPage = number ?? 0;
          state.size = size ?? state.size;
        }
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load your applications. Please try again.';
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        // eslint-disable-next-line no-console
        console.log('DEBUG applyToJob.fulfilled REDUCER — action.payload:', JSON.stringify(action.payload));
        state.successMessage = extractMessage(action.payload, CRUD_CREATE_MSG);
        state.warningMessage = null;
        state.error = null;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        // eslint-disable-next-line no-console
        console.log('DEBUG applyToJob.rejected REDUCER — action.payload:', JSON.stringify(action.payload));
        const payload = action.payload;
        if (payload && typeof payload === 'object' && payload.conflict) {
          state.warningMessage = payload.message || CAPACITY_WARNING_MSG;
          state.error = null;
        } else {
          state.error = extractMessage(payload, 'Failed to submit application.');
          state.warningMessage = null;
        }
      })
      .addCase(updateStage.pending, (state, action) => {
        const { id, stage } = action.meta.arg;
        const item = state.items.find((a) => a.id === id);
        if (item) item.currentStage = stage;
      })
      .addCase(updateStage.fulfilled, (state, action) => {
        state.successMessage = extractMessage(action.payload?.data, CRUD_UPDATE_MSG);
      })
      .addCase(updateStage.rejected, (state, action) => {
        state.error = extractMessage(action.payload, 'Failed to update stage.');
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload.id);
        state.successMessage = extractMessage(action.payload.data, CRUD_DELETE_MSG);
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = applicationSlice.actions;
export default applicationSlice.reducer;