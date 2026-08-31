import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      const token = response?.token;
      const role = response?.role;

      if (token) {
        localStorage.setItem('token', token);
      }

      if (role) {
        localStorage.setItem('role', role);
      }

      // Store user information
      const user = {
        username: credentials.username,
        role: role,
      };

      localStorage.setItem('user', JSON.stringify(user));

      return {
        ...response,
        user,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Login failed';

      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.register(userData);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Registration failed';

      return rejectWithValue(message);
    }
  }
);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialState = {
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  user: readStoredUser(),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');

      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN PENDING
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // LOGIN SUCCESS
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.token = action.payload?.token || null;

        state.role = action.payload?.role || null;

        state.user = action.payload?.user || null;

        state.isAuthenticated = !!state.token;
      })

      // LOGIN FAILED
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;

        state.error =
          action.payload || 'Login failed';
      })

      // REGISTER PENDING
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // REGISTER SUCCESS
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      // REGISTER FAILED
      .addCase(register.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || 'Registration failed';
      });
  },
});

export const {
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;