import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

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

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

// Accepts either { token, user: { role, ... } } or { token, role, ... }
// so the reducer isn't tied to one exact backend/mock response shape.
const resolveAuthPayload = (payload) => {
  const token = payload?.token ?? null;
  const user = payload?.user ?? (payload?.role ? { ...payload } : null);
  const role = payload?.role ?? payload?.user?.role ?? null;
  return { token, user, role };
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Unable to login. Please check your credentials.'
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
        err.response?.data?.message || 'Unable to register. Please try again.'
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
        const { token, user, role } = resolveAuthPayload(action.payload);
        state.token = token;
        state.user = user;
        state.role = role;
        state.isAuthenticated = !!token;
        if (token) localStorage.setItem('token', token);
        if (role) localStorage.setItem('role', role);
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