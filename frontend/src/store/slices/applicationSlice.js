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
  if (typeof err === 'string' && /401|unauthorized/i.test(err)) return true;
  if (err.message && /401|unauthorized/i.test(err.message)) return true;
  return false;
};

const is409 = (err) => err?.response?.status === 409 || err?.status === 409;

// FIX: server-provided messages must be checked BEFORE the generic
// Axios Error.message ("Request failed with status code 409"), which
// is always truthy on a real Axios error and was shadowing the real
// backend message every time. This was the actual cause of T23 failing
// whenever the capacity check relied on message content rather than
// status code alone.
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

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await applicationService.apply(jobId);
      return data;
    } catch (err) {
      if (is401(err)) clearSession();
      const rawMessage = extractMessage(err, '');
      if (is409(err) || /duplicate|already applied|capacity|exceed|full/i.test(rawMessage)) {
        return rejectWithValue({ conflict: true, message: rawMessage || 'Application capacity exceeded' });
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
      // T21
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.error = null;
        state.warningMessage = null;
        state.successMessage = extractMessage(action.payload, 'Application submitted successfully.');
      })
      // T23
      .addCase(applyToJob.rejected, (state, action) => {
        state.successMessage = null;
        const payload = action.payload;
        if (payload && typeof payload === 'object' && payload.conflict) {
          state.warningMessage = payload.message || 'Application capacity exceeded';
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
        state.successMessage = extractMessage(action.payload?.data, 'Application updated successfully.');
      })
      .addCase(updateStage.rejected, (state, action) => {
        state.error = extractMessage(action.payload, 'Failed to update stage.');
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload.id);
        state.successMessage = extractMessage(action.payload.data, 'Application deleted successfully.');
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = applicationSlice.actions;
export default applicationSlice.reducer;