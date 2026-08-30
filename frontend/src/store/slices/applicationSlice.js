import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';
import { clearSession } from '../../services/api';

const initialState = {
  items: [],
  myApplications: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 5,
  searchQuery: '',
  loading: false,
  error: null,
  successMessage: null,
  warningMessage: null,
};

const is401 = (err) => err?.response?.status === 401 || err?.status === 401;
const is409 = (err) => err?.response?.status === 409 || err?.status === 409;

// Pulls a human-readable message out of whatever shape the (possibly mocked)
// service throws or resolves with: a plain string, an Error, an Axios-style
// error, or a {message} / {data:{message}} object.
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

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      return await applicationService.getMyApplications();
    } catch (err) {
      if (is401(err)) clearSession();
      return rejectWithValue(extractMessage(err, 'Failed to load your applications.'));
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
      if (is409(err) || /duplicate|already applied|capacity/i.test(extractMessage(err, ''))) {
        return rejectWithValue({ conflict: true, message: 'Application capacity exceeded' });
      }
      return rejectWithValue({
        conflict: false,
        message: extractMessage(err, 'Failed to submit application.'),
      });
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
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
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
        state.error = action.payload || 'Failed to load applications.';
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.successMessage = extractMessage(action.payload, 'Application submitted successfully.');
      })
      .addCase(applyToJob.rejected, (state, action) => {
        const payload = action.payload;
        if (payload && typeof payload === 'object' && payload.conflict) {
          state.warningMessage = payload.message || 'Application capacity exceeded';
        } else {
          state.error = extractMessage(payload, 'Failed to submit application.');
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

export const { setSearchQuery, clearMessages } = applicationSlice.actions;
export default applicationSlice.reducer;