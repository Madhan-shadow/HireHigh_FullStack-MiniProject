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

const resolveAuthPayload = (data = {}) => {
  const token =
    data.token ??
    data.accessToken ??
    data.jwt ??
    data.user?.token ??
    null;

  const role =
    data.role ??
    data.userRole ??
    data.user?.role ??
    data.user?.userRole ??
    null;

  const user = data.user ?? (role ? { role, ...data } : null);

  return { token, role, user };
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);

      // DIAGNOSTIC — remove after you've captured this once
      console.log('[DIAG] raw login response from authService:', JSON.stringify(data));

      const resolved = resolveAuthPayload(data);

      // DIAGNOSTIC — remove after you've captured this once
      console.log('[DIAG] resolved auth payload:', JSON.stringify(resolved));

      return resolved;
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
        const { token, role, user } = action.payload;
        state.token = token;
        state.role = role;
        state.user = user;
        state.isAuthenticated = !!token;

        if (token) {
          localStorage.setItem('token', token);
        }

        if (role) {
          localStorage.setItem('role', role);
        }

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        // DIAGNOSTIC — remove after you've captured this once
        console.log('[DIAG] localStorage after login:', {
          token: localStorage.getItem('token'),
          role: localStorage.getItem('role'),
          user: localStorage.getItem('user'),
        });
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