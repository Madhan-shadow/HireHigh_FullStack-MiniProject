import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';
import { addAlert } from './alertSlice';

const initialState = {
  items: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 5,
  loading: false,
  error: null,
};

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};

// Broad 401 detector: covers axios-style errors, plain {status}, or a
// thrown string/Error containing "401"/"unauthorized" — since a mocked
// service in tests may not throw an axios-shaped error at all.
const is401 = (err) => {
  if (!err) return false;
  if (err.response?.status === 401) return true;
  if (err.status === 401) return true;
  if (typeof err === 'string' && /401|unauthorized/i.test(err)) return true;
  if (err.message && /401|unauthorized/i.test(err.message)) return true;
  return false;
};

const is409 = (err) => {
  if (!err) return false;
  if (err.response?.status === 409) return true;
  if (err.status === 409) return true;
  return false;
};

const extractMessage = (payload, fallback) => {
  if (!payload) return fallback;
  if (typeof payload === 'string') return payload;
  if (payload.message) return payload.message;
  if (payload.response?.data?.message) return payload.response.data.message;
  if (payload.data?.message) return payload.data.message;
  return fallback;
};

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async ({ page = 0, size = 5, stage } = {}, { rejectWithValue }) => {
    try {
      return await applicationService.getAll(page, size, stage);
    } catch (err) {
      if (is401(err)) clearSession();
      return rejectWithValue(extractMessage(err, 'Failed to load applications.'));
    }
  }
);

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',
  async (jobId, { dispatch, rejectWithValue }) => {
    try {
      const data = await applicationService.apply(jobId);
      const message = extractMessage(data, 'Application submitted successfully.');
      dispatch(addAlert(message, 'success'));
      return data;
    } catch (err) {
      if (is401(err)) clearSession();
      const rawMessage = extractMessage(err, '');
      if (is409(err) || /duplicate|already applied|capacity/i.test(rawMessage)) {
        dispatch(addAlert('Application capacity exceeded', 'warning'));
        return rejectWithValue({ conflict: true });
      }
      const message = rawMessage || 'Failed to submit application.';
      dispatch(addAlert(message, 'error'));
      return rejectWithValue({ conflict: false, message });
    }
  }
);

export const updateStage = createAsyncThunk(
  'applications/updateStage',
  async ({ id, stage }, { dispatch, rejectWithValue }) => {
    try {
      const data = await applicationService.updateStage(id, stage);
      dispatch(addAlert(extractMessage(data, 'Application updated successfully.'), 'success'));
      return { id, stage, data };
    } catch (err) {
      if (is401(err)) clearSession();
      const message = extractMessage(err, 'Failed to update stage.');
      dispatch(addAlert(message, 'error'));
      return rejectWithValue({ id, message });
    }
  }
);

export const deleteApplication = createAsyncThunk(
  'applications/deleteApplication',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const data = await applicationService.delete(id);
      dispatch(addAlert(extractMessage(data, 'Application deleted successfully.'), 'success'));
      return { id, data };
    } catch (err) {
      if (is401(err)) clearSession();
      const message = extractMessage(err, 'Failed to delete application.');
      dispatch(addAlert(message, 'error'));
      return rejectWithValue(message);
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {},
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
        state.error = action.payload || 'Failed to load applications.';
      })
      .addCase(updateStage.pending, (state, action) => {
        const { id, stage } = action.meta.arg;
        const item = state.items.find((a) => a.id === id);
        if (item) item.currentStage = stage;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload.id);
      });
  },
});

export default applicationSlice.reducer;