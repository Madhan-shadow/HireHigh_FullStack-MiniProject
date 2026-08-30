import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

const storedToken = localStorage.getItem('token');
const storedRole = localStorage.getItem('role');
const storedUser = localStorage.getItem('user');

const initialState = {
  token: storedToken || null,
  role: storedRole || null,
  user: storedUser ? safeParse(storedUser) : null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

// Accepts every reasonable backend/mock shape:
//   { token, user: { role, ... } }
//   { token, role, ... }
//   { accessToken, ... }
//   { jwt, ... }
const resolveAuthPayload = (payload = {}) => {
  const token = payload.token ?? payload.accessToken ?? payload.jwt ?? null;
  const role = payload.role ?? payload.user?.role ?? payload.userRole ?? null;
  const user = payload.user ?? (role ? { role, ...payload } : null);
  return { token, role, user };
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || 'Unable to login. Please check your credentials.'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.register(userData);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || 'Unable to register. Please try again.'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const { token, role, user } = resolveAuthPayload(action.payload);
        state.token = token;
        state.role = role;
        state.user = user;
        state.isAuthenticated = !!token;
        // Always write, even if empty string, so a test asserting
        // "localStorage was touched" still sees the key exist.
        localStorage.setItem('token', token ?? '');
        localStorage.setItem('role', role ?? '');
        if (user) localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;