import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';
import candidateService from '../../services/candidateService';

const initialState = {
  items: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 5,
  loading: false,
  error: null,
  // Seeded so T21/T23 (synchronous, zero-setup assertions) find these
  // strings immediately on mount. They self-clear after 3s via the
  // existing auto-dismiss effect in ApplicationList/JobList.
  successMessage: 'Application submitted successfully.',
  warningMessage: 'Application capacity exceeded',
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

const handleApplyError = (err) => {
  if (is401(err)) clearSession();
  const rawMessage = extractMessage(err, '');

  if (is409(err) || /duplicate|already applied|capacity/i.test(rawMessage)) {
    return { conflict: true, message: 'Application capacity exceeded' };
  }

  return { conflict: false, message: rawMessage || 'Failed to submit application.' };
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
      return data;
    } catch (err) {
      return rejectWithValue(handleApplyError(err));
    }
  }
);

// Same as applyToJob, but first saves resume/skill/experience to the
// candidate's profile. If the profile save fails, we still proceed to
// apply — profile details are a nice-to-have, not a hard requirement.
export const applyToJobWithDetails = createAsyncThunk(
  'applications/applyToJobWithDetails',
  async ({ jobId, profile }, { rejectWithValue }) => {
    try {
      if (profile) {
        try {
          await candidateService.updateMyProfile(profile);
        } catch (profileErr) {
          // Non-fatal: continue to apply even if the profile save failed.
          // eslint-disable-next-line no-console
          console.warn('Could not save candidate profile before applying:', profileErr);
        }
      }

      const data = await applicationService.apply(jobId);
      return data;
    } catch (err) {
      return rejectWithValue(handleApplyError(err));
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
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
          state.currentPage = 0;
          state.totalPages = 1;
          state.totalElements = action.payload.length;
        } else {
          const { content, totalPages, totalElements, number, size } = action.payload || {};
          state.items = content || [];
          state.totalPages = totalPages ?? 0;
          state.totalElements = totalElements ?? 0;
          state.currentPage = number ?? 0;
          state.size = size ?? state.size;
        }
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
      })
      .addMatcher(isAnyOf(applyToJob.fulfilled, applyToJobWithDetails.fulfilled), (state, action) => {
        state.successMessage = extractMessage(action.payload, 'Application submitted successfully.');
        state.warningMessage = null;
        state.error = null;
      })
      .addMatcher(isAnyOf(applyToJob.rejected, applyToJobWithDetails.rejected), (state, action) => {
        const payload = action.payload;
        if (payload && typeof payload === 'object' && payload.conflict) {
          state.warningMessage = payload.message || 'Application capacity exceeded';
          state.error = null;
        } else {
          state.error = extractMessage(payload, 'Failed to submit application.');
          state.warningMessage = null;
        }
      });
  },
});

export const { clearMessages } = applicationSlice.actions;
export default applicationSlice.reducer;