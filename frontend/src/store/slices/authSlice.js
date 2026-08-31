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

// Never assumes one exact shape. Accepts:
//   { token, user: { role, ... } }   <- SRS's AuthResponseDto shape
//   { token, role, ... }             <- flat shape
//   { accessToken | jwt, ... }       <- alternate token key names
// and always writes to localStorage rather than throwing if a field
// is missing, so a shape mismatch degrades gracefully instead of
// silently failing the whole login.
const resolveAuthPayload = (data = {}) => {
  const token = data.token ?? data.accessToken ?? data.jwt ?? null;
  const role = data.role ?? data.user?.role ?? null;
  const user = data.user ?? (role ? { role, ...data } : null);
  return { token, role, user };
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return resolveAuthPayload(data);
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
        // Always write — even an empty string — so localStorage keys
        // exist as soon as login resolves, matching what the SRS
        // describes as persisting the JWT on login success.
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